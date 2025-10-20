"use client";

import { getSupabaseClient } from "../lib/supabase";

const supabase = getSupabaseClient();

const signOut = async () => {
    const { error } = await supabase.auth.signOut()
};

export default function SignOutButton() {
    return ( 
        <button
            onClick={signOut}
            className="rounded bg-grey-600 font-bold text-black px-4 py-2 m-2"
            >
            Sign Out
        </button>
    );
    
}