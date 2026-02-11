'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePrepList } from '@/hooks/use-prep-list';
import { useStations } from '@/hooks/use-stations';
import { useIncrementTask, useUpdatePrepTask } from '@/hooks/use-prep-tasks';
import { useRealtimePrepTasks } from '@/hooks/use-realtime-prep';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { PrepTask } from '@/types/database';

function todayString() {
    return new Date().toISOString().slice(0, 10);
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-slate-800', text: 'text-slate-300', label: 'Pending' },
    in_progress: { bg: 'bg-amber-900/40', text: 'text-amber-300', label: 'In Progress' },
    done: { bg: 'bg-emerald-900/40', text: 'text-emerald-300', label: 'Done' },
    skipped: { bg: 'bg-rose-900/40', text: 'text-rose-300', label: 'Skipped' },
};

function TaskCard({
    task,
    prepDate,
    stationColor,
}: {
    task: PrepTask;
    prepDate: string;
    stationColor: string;
}) {
    const increment = useIncrementTask(prepDate);
    const updateTask = useUpdatePrepTask(prepDate);
    const style = STATUS_STYLES[task.status] ?? STATUS_STYLES.pending;
    const pct =
        task.quantity_needed > 0
            ? Math.round((task.quantity_done / task.quantity_needed) * 100)
            : 0;

    function handleIncrement() {
        if (task.status === 'done' || task.status === 'skipped') return;
        increment.mutate({
            taskId: task.id,
            currentDone: task.quantity_done,
            quantityNeeded: task.quantity_needed,
        });
    }

    function handleComplete() {
        updateTask.mutate({
            taskId: task.id,
            updates: {
                status: 'done',
                quantity_done: task.quantity_needed,
                completed_at: new Date().toISOString(),
            },
        });
    }

    function handleSkip() {
        updateTask.mutate({
            taskId: task.id,
            updates: { status: 'skipped' },
        });
    }

    function handleReset() {
        updateTask.mutate({
            taskId: task.id,
            updates: {
                status: 'pending',
                quantity_done: 0,
                started_at: null,
                completed_at: null,
            },
        });
    }

    const isDone = task.status === 'done' || task.status === 'skipped';

    return (
        <div
            className={`rounded-xl border border-slate-700/50 p-4 transition-all ${isDone ? 'opacity-60' : ''}`}
            style={{ borderLeftWidth: 4, borderLeftColor: stationColor }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-lg leading-tight">
                        {task.menu_item?.name ?? 'Unknown Item'}
                    </h3>
                    <span className="text-xs text-slate-500 mt-0.5">
                        {task.menu_item?.unit ?? 'units'}
                    </span>
                </div>
                <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${style.bg} ${style.text}`}
                >
                    {style.label}
                </span>
            </div>

            {/* Progress */}
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-bold tabular-nums">
                        {task.quantity_done} / {task.quantity_needed}
                    </span>
                </div>
                <Progress value={pct} className="h-3 bg-slate-800" />
            </div>

            {/* Actions */}
            {!isDone ? (
                <div className="flex gap-2">
                    {/* Big increment button */}
                    <Button
                        onClick={handleIncrement}
                        disabled={increment.isPending}
                        className="flex-1 h-14 text-lg font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 active:scale-95 transition-transform"
                    >
                        +1
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={updateTask.isPending}
                        variant="outline"
                        className="h-14 px-4 border-emerald-800 text-emerald-400 hover:bg-emerald-900/30 hover:text-emerald-300"
                    >
                        ✓ All
                    </Button>
                    <Button
                        onClick={handleSkip}
                        disabled={updateTask.isPending}
                        variant="outline"
                        className="h-14 px-4 border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                    >
                        Skip
                    </Button>
                </div>
            ) : (
                <Button
                    onClick={handleReset}
                    variant="ghost"
                    className="w-full text-xs text-slate-500 hover:text-slate-300"
                >
                    Reset
                </Button>
            )}
        </div>
    );
}

export default function StationPage() {
    const params = useParams();
    const router = useRouter();
    const stationId = params.stationId as string;
    const today = todayString();

    const { data: prepList, isLoading } = usePrepList(today);
    const { data: stations } = useStations();
    useRealtimePrepTasks(today);

    const station = stations?.find((s) => s.id === stationId);
    const stationColor = station?.color ?? '#64748b';

    const tasks = useMemo(() => {
        if (!prepList?.prep_tasks) return [];
        return prepList.prep_tasks.filter(
            (t) => t.menu_item?.station?.id === stationId
        );
    }, [prepList, stationId]);

    const done = tasks.filter((t) => t.status === 'done').length;
    const pct =
        tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

    if (!isLoading && !station) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <p className="text-lg text-slate-300">Station not found</p>
                <Button
                    variant="outline"
                    onClick={() => router.push('/kitchen')}
                    className="border-slate-700"
                >
                    ← Back
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
            {/* Station header */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: stationColor }}
                    />
                    <h1 className="text-2xl font-bold">
                        {station?.name ?? 'Station'}
                    </h1>
                </div>

                {tasks.length > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-sm text-slate-400">
                            <span>
                                {done}/{tasks.length} tasks done
                            </span>
                            <span className="font-semibold text-white">
                                {pct}%
                            </span>
                        </div>
                        <Progress
                            value={pct}
                            className="h-2.5 bg-slate-800"
                        />
                    </div>
                )}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="h-48 rounded-xl bg-slate-800"
                        />
                    ))}
                </div>
            )}

            {/* No tasks */}
            {!isLoading && tasks.length === 0 && (
                <div className="text-center py-16 space-y-2">
                    <p className="text-3xl">✨</p>
                    <p className="text-slate-300">No tasks for this station</p>
                </div>
            )}

            {/* Task cards */}
            <div className="space-y-4">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        prepDate={today}
                        stationColor={stationColor}
                    />
                ))}
            </div>
        </div>
    );
}
