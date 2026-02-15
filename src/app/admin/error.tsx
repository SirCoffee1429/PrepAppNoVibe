'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[AdminError]', error);
    }, [error]);

    return (
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-sm text-center space-y-4 animate-fade-in">
                <div className="text-5xl">📊</div>
                <h2 className="text-xl font-bold">Dashboard Error</h2>
                <p className="text-muted-foreground text-sm">
                    {error.message || 'Something went wrong loading this page.'}
                </p>
                <Button onClick={reset} className="bg-accent hover:bg-accent/90 text-white">
                    Retry
                </Button>
            </div>
        </div>
    );
}
