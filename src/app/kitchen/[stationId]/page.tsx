'use client';

import { useParams } from 'next/navigation';
import { usePrepList } from '@/hooks/use-prep-list';
import { useStations } from '@/hooks/use-stations';
import { useRealtimePrepTasks } from '@/hooks/use-realtime-prep';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { PrepTaskCard } from '@/components/prep-task-card';
import { EmptyState } from '@/components/layout/empty-state';

function todayString() {
    return new Date().toISOString().slice(0, 10);
}

export default function StationPage() {
    const { stationId } = useParams<{ stationId: string }>();
    const today = todayString();
    const { data: prepList, isLoading } = usePrepList(today);
    const { data: stations } = useStations();
    useRealtimePrepTasks(today);

    const station = stations?.find((s) => s.id === stationId);
    const tasks = (prepList?.prep_tasks ?? []).filter(
        (t) => t.menu_item?.station_id === stationId
    );
    const totalDone = tasks.filter((t) => t.status === 'done').length;
    const pct =
        tasks.length > 0 ? Math.round((totalDone / tasks.length) * 100) : 0;

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-48 bg-slate-800" />
                <Skeleton className="h-3 w-full bg-slate-800" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-52 rounded-xl bg-slate-800"
                    />
                ))}
            </div>
        );
    }

    if (!station) {
        return (
            <EmptyState
                icon={<span>❓</span>}
                title="Station not found"
                description="This station may have been removed or the link is invalid"
                className="h-full"
            />
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-5 animate-fade-in">
            {/* Station header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: station.color }}
                    />
                    <h1 className="text-2xl font-bold">{station.name}</h1>
                    <span
                        className="text-xl font-bold ml-auto tabular-nums"
                        style={{ color: station.color }}
                    >
                        {pct}%
                    </span>
                </div>
                <Progress value={pct} className="h-2 bg-slate-800" />
                <p className="text-xs text-slate-400">
                    {totalDone} of {tasks.length} tasks complete
                </p>
            </div>

            {/* Task cards */}
            {tasks.length === 0 ? (
                <EmptyState
                    title="No tasks for this station"
                    description="All tasks may be completed or no tasks were generated"
                />
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <PrepTaskCard
                            key={task.id}
                            task={task}
                            prepDate={today}
                            stationColor={station.color}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
