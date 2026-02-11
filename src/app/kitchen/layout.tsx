'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStations } from '@/hooks/use-stations';
import { cn } from '@/lib/utils';

export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: stations } = useStations();

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            {/* Top bar */}
            <header className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
                <Link
                    href="/kitchen"
                    className="flex items-center gap-2.5"
                >
                    <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
                        <span className="text-white font-bold text-sm">P</span>
                    </div>
                    <span className="font-semibold text-sm tracking-wide">
                        PrepAppNoVibe
                    </span>
                </Link>

                {/* Station pills */}
                <nav className="flex items-center gap-1.5 overflow-x-auto">
                    <Link
                        href="/kitchen"
                        className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                            pathname === '/kitchen'
                                ? 'bg-white text-slate-900'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        )}
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
                                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
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
                            >
                                {s.name}
                            </Link>
                        );
                    })}
                </nav>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}
