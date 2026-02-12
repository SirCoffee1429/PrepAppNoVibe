import { cn } from '@/lib/utils';
import type { TaskStatus } from '@/types/database';

/** Status display variants for light backgrounds (admin pages) */
const LIGHT_STYLES: Record<TaskStatus, string> = {
    pending: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    skipped: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300',
};

/** Status labels */
const LABELS: Record<TaskStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    done: 'Done',
    skipped: 'Skipped',
};

interface StatusBadgeProps {
    status: TaskStatus;
    className?: string;
}

/**
 * Status-aware badge that maps TaskStatus values to appropriate colors.
 * Replaces duplicated STATUS_COLORS / STATUS_STYLES across
 * admin/prep/page.tsx and kitchen/[stationId]/page.tsx.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                'inline-block px-2 py-0.5 rounded-full text-xs font-medium',
                LIGHT_STYLES[status],
                className
            )}
        >
            {LABELS[status]}
        </span>
    );
}
