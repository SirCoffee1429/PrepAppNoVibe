'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminTopbar } from '@/components/layout/admin-topbar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, profile, signOut } = useAuth();
    const router = useRouter();

    async function handleSignOut() {
        await signOut();
        router.push('/login');
    }

    return (
        <div className="min-h-screen flex bg-background">
            <AdminSidebar
                pathname={pathname}
                user={user}
                profile={profile}
                onSignOut={handleSignOut}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar pathname={pathname} />
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
