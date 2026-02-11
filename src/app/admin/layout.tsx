'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/menu', label: 'Menu Items', icon: '🍽️' },
    { href: '/admin/pars', label: 'Par Levels', icon: '📋' },
    { href: '/admin/prep', label: 'Prep Lists', icon: '🔥' },
];

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
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/50">
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border/50">
                    <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shadow-md shadow-accent/20">
                        <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <div>
                        <span className="font-semibold text-foreground text-sm">
                            PrepAppNoVibe
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-none mt-0.5">
                            Admin Panel
                        </p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive =
                            item.href === '/admin'
                                ? pathname === '/admin'
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                                    isActive
                                        ? 'bg-accent/10 text-accent'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                )}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="border-t border-border/50 px-4 py-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {(
                                profile?.full_name?.[0] ??
                                user?.email?.[0] ??
                                'A'
                            ).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {profile?.full_name ?? 'Admin'}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSignOut}
                        className="w-full text-xs"
                    >
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile top bar */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-md bg-accent flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                                P
                            </span>
                        </div>
                        <span className="font-semibold text-sm">Admin</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive =
                                item.href === '/admin'
                                    ? pathname === '/admin'
                                    : pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'text-lg p-1.5 rounded-md transition-colors',
                                        isActive
                                            ? 'bg-accent/10'
                                            : 'opacity-50 hover:opacity-100'
                                    )}
                                    title={item.label}
                                >
                                    {item.icon}
                                </Link>
                            );
                        })}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
