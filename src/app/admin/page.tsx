'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function AdminPage() {
    const { user, profile, signOut, isLoading } = useAuth();
    const router = useRouter();

    async function handleSignOut() {
        await signOut();
        router.push('/login');
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    <span>Loading…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Top bar */}
            <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                            <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <div>
                            <h1 className="font-semibold text-foreground">
                                Admin Dashboard
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                {profile?.full_name ?? user?.email}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Sign Out
                    </Button>
                </div>
            </header>

            {/* Body */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Profile</CardTitle>
                            <CardDescription>Your account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Name</span>
                                <span className="font-medium">
                                    {profile?.full_name ?? '—'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email</span>
                                <span className="font-medium">{user?.email ?? '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Role</span>
                                <span className="font-medium capitalize">
                                    {profile?.role ?? '—'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Stats</CardTitle>
                            <CardDescription>At a glance</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            <p>Dashboard content coming soon…</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Actions</CardTitle>
                            <CardDescription>Admin tools</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            <p>Management features coming soon…</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
