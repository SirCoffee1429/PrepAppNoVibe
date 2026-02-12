'use client';

import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavItem {
    href: string;
    label: string;
    icon: string;
}

const NAV_ITEMS: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/menu', label: 'Menu Items', icon: '🍽️' },
    { href: '/admin/pars', label: 'Par Levels', icon: '📋' },
    { href: '/admin/prep', label: 'Prep Lists', icon: '🔥' },
];

interface AdminSidebarProps {
    pathname: string;
    user: User | null;
    profile: Profile | null;
    onSignOut: () => void;
}

/**
 * Admin sidebar with branding, navigation, user info, and theme toggle.
 * Extracted from admin/layout.tsx for reusability and separation of concerns.
 */
export function AdminSidebar({
    pathname,
    user,
    profile,
    onSignOut,
}: AdminSidebarProps) {
    return (
        <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/50">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border/50">
                <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shadow-md shadow-accent/20">
                    <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                    <span className="font-semibold text-foreground text-sm">
                        PrepBrain
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-none mt-0.5">
                        Admin Panel
                    </p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
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
                            aria-current={isActive ? 'page' : undefined}
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
                    <ThemeToggle />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onSignOut}
                    className="w-full text-xs"
                >
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}

/** Exported for use in mobile topbar */
export { NAV_ITEMS };
export type { NavItem };
