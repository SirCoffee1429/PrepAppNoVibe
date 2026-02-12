'use client';

import { usePathname } from 'next/navigation';
import { useStations } from '@/hooks/use-stations';
import { KitchenHeader } from '@/components/layout/kitchen-header';

export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: stations } = useStations();

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-white">
            <KitchenHeader pathname={pathname} stations={stations} />
            <main className="flex-1 overflow-auto" role="main" aria-live="polite">{children}</main>
        </div>
    );
}
