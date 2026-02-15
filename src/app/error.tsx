'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[GlobalError]', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
                <div className="text-6xl">⚠️</div>
                <h1 className="text-2xl font-bold">Something went wrong</h1>
                <p className="text-muted-foreground text-sm">
                    An unexpected error occurred. Please try again or contact
                    support if the problem persists.
                </p>
                {error.message && (
                    <pre className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg overflow-auto max-h-24">
                        {error.message}
                    </pre>
                )}
                <div className="flex gap-3 justify-center">
                    <Button onClick={reset} className="bg-accent hover:bg-accent/90 text-white">
                        Try Again
                    </Button>
                    <Button variant="outline" onClick={() => (window.location.href = '/')}>
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
