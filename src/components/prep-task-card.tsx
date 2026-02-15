'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/status-badge';
import { useIncrementTask, useUpdatePrepTask } from '@/hooks/use-prep-tasks';
import type { PrepTask } from '@/types/database';

interface PrepTaskCardProps {
    /** The task to render */
    task: PrepTask;
    /** The prep date string (for cache invalidation) */
    prepDate: string;
    /** Station color for the left border accent */
    stationColor: string;
}

/**
 * Interactive task card for kitchen station views.
 * Supports +1 increment, complete all, skip, and reset actions.
 * Extracted from kitchen/[stationId]/page.tsx.
 */
export function PrepTaskCard({
    task,
    prepDate,
    stationColor,
}: PrepTaskCardProps) {
    const increment = useIncrementTask(prepDate);
    const updateTask = useUpdatePrepTask(prepDate);

    const pct =
        task.quantity_needed > 0
            ? Math.round((task.quantity_done / task.quantity_needed) * 100)
            : 0;

    const isDone = task.status === 'done' || task.status === 'skipped';

    function handleIncrement() {
        if (isDone) return;
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

    return (
        <div
            className={`rounded-xl border border-slate-700/50 p-4 transition-all animate-slide-up ${isDone ? 'opacity-60' : ''}`}
            style={{ borderLeftWidth: 4, borderLeftColor: stationColor }}
            role="article"
            aria-label={`Prep task: ${task.menu_item?.name ?? 'Unknown'}`}
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
                <StatusBadge status={task.status} />
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
                    <Button
                        onClick={handleIncrement}
                        disabled={increment.isPending}
                        className="flex-1 h-14 text-lg font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 active:scale-95 transition-transform touch-target"
                        aria-label={`Add 1 to ${task.menu_item?.name}`}
                    >
                        +1
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={updateTask.isPending}
                        variant="outline"
                        className="h-14 px-4 border-emerald-800 text-emerald-400 hover:bg-emerald-900/30 hover:text-emerald-300 touch-target"
                        aria-label={`Complete all ${task.menu_item?.name}`}
                    >
                        ✓ All
                    </Button>
                    <Button
                        onClick={handleSkip}
                        disabled={updateTask.isPending}
                        variant="outline"
                        className="h-14 px-4 border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300 touch-target"
                        aria-label={`Skip ${task.menu_item?.name}`}
                    >
                        Skip
                    </Button>
                </div>
            ) : (
                <Button
                    onClick={handleReset}
                    variant="ghost"
                    className="w-full text-xs text-slate-500 hover:text-slate-300"
                    aria-label={`Reset ${task.menu_item?.name}`}
                >
                    Reset
                </Button>
            )}
        </div>
    );
}
