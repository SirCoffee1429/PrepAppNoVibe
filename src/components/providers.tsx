'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
                <Toaster richColors position="top-right" />
            </AuthProvider>
        </QueryClientProvider>
    );
}
