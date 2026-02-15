'use client';

import { usePrepList } from '@/hooks/use-prep-list';
import { useStations } from '@/hooks/use-stations';
import { useRealtimePrepTasks } from '@/hooks/use-realtime-prep';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { StationOverviewCard } from '@/components/station-overview-card';
import { EmptyState } from '@/components/layout/empty-state';

function todayString() {
    return new Date().toISOString().slice(0, 10);
}

export default function KitchenOverview() {
    const today = todayString();
    const { data: prepList, isLoading } = usePrepList(today);
    const { data: stations } = useStations();
    useRealtimePrepTasks(today);

    const tasks = prepList?.prep_tasks ?? [];
    const totalDone = tasks.filter((t) => t.status === 'done').length;
    const overallPct =
        tasks.length > 0 ? Math.round((totalDone / tasks.length) * 100) : 0;

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-48 bg-slate-800" />
                <Skeleton className="h-3 w-full bg-slate-800" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="h-40 rounded-xl bg-slate-800"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <EmptyState
                icon={<span>📋</span>}
                title="No prep today"
                description="Generate a prep list from the admin panel to get started"
                className="h-full"
            />
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6 animate-fade-in">
            {/* Overall progress */}
            <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                    <h1 className="text-xl font-bold">
                        Today&apos;s Prep
                    </h1>
                    <span className="text-2xl font-bold text-accent tabular-nums">
                        {overallPct}%
                    </span>
                </div>
                <Progress value={overallPct} className="h-3 bg-slate-800" />
                <p className="text-xs text-slate-400">
                    {totalDone} of {tasks.length} tasks complete
                </p>
            </div>

            {/* Station cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stations?.map((station) => {
                    const stationTasks = tasks.filter(
                        (t) => t.menu_item?.station_id === station.id
                    );
                    return (
                        <StationOverviewCard
                            key={station.id}
                            station={station}
                            tasks={stationTasks}
                        />
                    );
                })}
            </div>
        </div>
    );
}
