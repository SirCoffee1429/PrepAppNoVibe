'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function KitchenError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[KitchenError]', error);
    }, [error]);

    return (
        <div className="flex-1 flex items-center justify-center p-8 bg-slate-950 text-white">
            <div className="max-w-sm text-center space-y-4 animate-fade-in">
                <div className="text-5xl">🔥</div>
                <h2 className="text-xl font-bold">Kitchen Error</h2>
                <p className="text-sm text-slate-400">
                    {error.message || 'Something went wrong.'}
                </p>
                <Button
                    onClick={reset}
                    className="h-14 px-8 text-lg bg-accent hover:bg-accent/90 text-white touch-target"
                >
                    Retry
                </Button>
            </div>
        </div>
    );
}
