'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/components/layout/admin-sidebar';

interface AdminTopbarProps {
    pathname: string;
}

/**
 * Mobile-only top bar for admin pages, showing icon-based navigation.
 * Extracted from admin/layout.tsx.
 */
export function AdminTopbar({ pathname }: AdminTopbarProps) {
    return (
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50">
            <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-accent flex items-center justify-center">
                    <span className="text-white font-bold text-xs">P</span>
                </div>
                <span className="font-semibold text-sm">Admin</span>
            </div>
            <nav className="flex items-center gap-2" aria-label="Admin navigation">
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
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {item.icon}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
