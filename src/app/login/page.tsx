'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        const { error } = await signIn(email, password);

        if (error) {
            toast.error('Login failed', {
                description: error.message,
            });
            setIsSubmitting(false);
            return;
        }

        toast.success('Welcome back!');
        router.push('/admin');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-accent/20 px-4">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.12),rgba(255,255,255,0))]" />

            <Card className="relative w-full max-w-md border-border/30 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/20">
                <CardHeader className="text-center space-y-3 pb-2">
                    {/* Logo */}
                    <div className="mx-auto h-12 w-12 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/25">
                        <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Admin Login
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                            Sign in to access the admin dashboard
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                autoFocus
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                minLength={6}
                                className="h-11"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-medium transition-all hover:shadow-lg hover:shadow-accent/25"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-4 w-4"
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
                                    Signing in…
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
