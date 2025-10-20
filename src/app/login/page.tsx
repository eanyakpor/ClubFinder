/*
    This is the login page for the application.
    User will be authenticated here with google oauth + supabase 
*/
'use client'
import { useState, useEffect } from "react";
import { getSupabaseClient } from "../lib/supabase";
import { Auth }  from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { NextResponse } from "next/server";

// creating a supabase client 
const supabase = getSupabaseClient();

export default function LoginPage() {

    // track the current auth session in state 
    const [session, setSession] = useState<null | Record<string, any>>(null);
    
    /*
        on first load run this useEffect =>
        asks supabase if the user is already logged in 
        object destruction example 
        const response = await supabase.auth.getSession();
        const session = response.data.session;
    */
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        
        // listener for when the user logs in or out or the token refreshes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {

            // clean up to not waste resources while listening for supabase.auth.onAuth... in the background 
            subscription.unsubscribe();
        };
    }, []);

    const checkUserRole = async () => {
        if (session?.user) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("user_id", session.user.id)
                .maybeSingle();

            if (profile?.role) {
                // User already has a role, redirect based on role
                if (profile.role === "club") {
                    // Check if club is onboarded
                    const { data: club } = await supabase
                        .from("clubs")
                        .select("id")
                        .eq("owner_user_id", session.user.id)
                        .maybeSingle();
                    
                    if (club) {
                        window.location.href = "/"; // Go to homepage
                    } else {
                        window.location.href = "/onboarding/club"; // Complete onboarding
                    }
                } else {
                    window.location.href = "/"; // Student goes to homepage
                }
            } else {
                // No role selected, go to role selection
                window.location.href = "/role";
            }
        }
    };

    useEffect(() => {
        if (session?.user) {
            checkUserRole();
        }
    }, [session]);

    /*
        google prodives tons of metadata as a user logs in session
        checkoout console.log(session)
    */

    const signUp = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
        });
    };

    if (!session) {
        return (

            // if user is logged show the Supabase Auth Ui
            // <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
            <>
                <button
                    onClick={signUp}
                    className="rounded bg-black font-bold text-white px-4 py-2 m-2"
                    >
                    Sign in with Google
                </button>
            </>
        );
    } else {
        return (
            <div>
                <h2>Welcome, {session?.user?.email}</h2>
                <p>Redirecting...</p>
            </div>  
        );
    }
}