'use client';

import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import type { Profile } from '@/types/auth';

interface AuthContextValue {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined
);

// Singleton browser client
let browserClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
    if (!browserClient) {
        browserClient = createClient();
    }
    return browserClient;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = getSupabase();

    // Fetch profile from public.profiles
    const fetchProfile = useCallback(
        async (userId: string) => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            setProfile(data as Profile | null);
        },
        [supabase]
    );

    useEffect(() => {
        // Get the initial session
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);

            if (initialSession?.user) {
                fetchProfile(initialSession.user.id);
            }

            setIsLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (newSession?.user) {
                fetchProfile(newSession.user.id);
            } else {
                setProfile(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, fetchProfile]);

    const signIn = useCallback(
        async (email: string, password: string) => {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return { error: error as Error | null };
        },
        [supabase]
    );

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
    }, [supabase]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            session,
            profile,
            isLoading,
            signIn,
            signOut,
        }),
        [user, session, profile, isLoading, signIn, signOut]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
