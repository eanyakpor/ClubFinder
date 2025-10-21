"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import NavBar from "./NavBar/NavBar";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "../lib/supabaseServer";
// import { getCurrentUser } from "../lib/auth-actions";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export default function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  const refreshUser = async () => {
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      console.log("User session check:", { session });
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Get initial session if no initial user provided
    if (!initialUser) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log("Initial session check:", { session });
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", { event, user: session?.user });
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [initialUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      <NavBar user={user} />
      {children}
    </AuthContext.Provider>
  );
}
