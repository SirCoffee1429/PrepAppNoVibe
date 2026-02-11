'use client';

import Link from 'next/link';
import { usePrepList } from '@/hooks/use-prep-list';
import { useStations } from '@/hooks/use-stations';
import { useRealtimePrepTasks } from '@/hooks/use-realtime-prep';
import type { PrepTask, Station } from '@/types/database';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

function todayString() {
    return new Date().toISOString().slice(0, 10);
}

interface StationStats {
    station: Station;
    tasks: PrepTask[];
    done: number;
    inProgress: number;
    pending: number;
    pct: number;
}

export default function KitchenPage() {
    const today = todayString();
    const { data: prepList, isLoading } = usePrepList(today);
    const { data: stations } = useStations();
    useRealtimePrepTasks(today);

    const stationStats = useMemo<StationStats[]>(() => {
        if (!stations || !prepList?.prep_tasks) return [];

        return stations.map((station) => {
            const tasks = prepList.prep_tasks!.filter(
                (t) => t.menu_item?.station?.id === station.id
            );
            const done = tasks.filter((t) => t.status === 'done').length;
            const inProgress = tasks.filter(
                (t) => t.status === 'in_progress'
            ).length;
            const pending = tasks.filter(
                (t) => t.status === 'pending'
            ).length;
            const pct =
                tasks.length > 0
                    ? Math.round((done / tasks.length) * 100)
                    : 0;

            return { station, tasks, done, inProgress, pending, pct };
        });
    }, [stations, prepList]);

    const totalTasks = prepList?.prep_tasks?.length ?? 0;
    const totalDone =
        prepList?.prep_tasks?.filter((t) => t.status === 'done').length ?? 0;
    const overallPct =
        totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
            {/* Overall summary */}
            <div className="text-center space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    Kitchen Prep
                </h1>
                <p className="text-slate-400">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                    })}
                </p>

                {totalTasks > 0 && (
                    <div className="max-w-xs mx-auto space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Overall</span>
                            <span className="font-semibold">
                                {totalDone}/{totalTasks} · {overallPct}%
                            </span>
                        </div>
                        <Progress
                            value={overallPct}
                            className="h-3 bg-slate-800"
                        />
                    </div>
                )}
            </div>

            {/* No prep list state */}
            {!isLoading && !prepList && (
                <div className="text-center py-16 space-y-3">
                    <p className="text-5xl">📋</p>
                    <p className="text-xl text-slate-300">
                        No prep list for today
                    </p>
                    <p className="text-slate-500 text-sm">
                        Ask your admin to generate today&apos;s prep list
                    </p>
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="h-40 rounded-xl bg-slate-800"
                        />
                    ))}
                </div>
            )}

            {/* Station cards */}
            {stationStats.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stationStats.map(
                        ({ station, tasks, done, inProgress, pending, pct }) => (
                            <Link
                                key={station.id}
                                href={`/kitchen/${station.id}`}
                                className="group relative rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-slate-600 hover:bg-slate-900 active:scale-[0.98]"
                            >
                                {/* Color bar */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                                    style={{ backgroundColor: station.color }}
                                />

                                <div className="flex items-start justify-between mb-4">
                                    <h2 className="text-lg font-semibold">
                                        {station.name}
                                    </h2>
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: station.color }}
                                    >
                                        {pct}%
                                    </span>
                                </div>

                                <Progress
                                    value={pct}
                                    className="h-2 mb-4 bg-slate-800"
                                />

                                {tasks.length > 0 ? (
                                    <div className="flex gap-4 text-xs text-slate-400">
                                        <span>
                                            <span className="text-emerald-400 font-medium">
                                                {done}
                                            </span>{' '}
                                            done
                                        </span>
                                        <span>
                                            <span className="text-amber-400 font-medium">
                                                {inProgress}
                                            </span>{' '}
                                            active
                                        </span>
                                        <span>
                                            <span className="text-slate-300 font-medium">
                                                {pending}
                                            </span>{' '}
                                            pending
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500">
                                        No tasks
                                    </p>
                                )}
                            </Link>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
