'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Station } from '@/types/database';

interface KitchenHeaderProps {
    pathname: string;
    stations: Station[] | undefined;
}

/**
 * Kitchen top bar with station pill navigation.
 * Extracted from kitchen/layout.tsx.
 */
export function KitchenHeader({ pathname, stations }: KitchenHeaderProps) {
    return (
        <header className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
            <Link href="/kitchen" className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
                    <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-semibold text-sm tracking-wide">
                    PrepBrain
                </span>
            </Link>

            {/* Station pills */}
            <nav
                className="flex items-center gap-1.5 overflow-x-auto"
                aria-label="Kitchen stations"
            >
                <Link
                    href="/kitchen"
                    className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap touch-target',
                        pathname === '/kitchen'
                            ? 'bg-white text-slate-900'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    )}
                    aria-current={pathname === '/kitchen' ? 'page' : undefined}
                >
                    All
                </Link>
                {stations?.map((s) => {
                    const isActive = pathname.includes(s.id);
                    return (
                        <Link
                            key={s.id}
                            href={`/kitchen/${s.id}`}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap touch-target',
                                isActive
                                    ? 'text-white'
                                    : 'text-slate-400 hover:text-white'
                            )}
                            style={
                                isActive
                                    ? { backgroundColor: s.color }
                                    : {
                                        backgroundColor: `${s.color}20`,
                                        borderColor: `${s.color}40`,
                                    }
                            }
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {s.name}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
