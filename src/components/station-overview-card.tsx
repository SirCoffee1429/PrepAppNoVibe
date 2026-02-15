import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import type { PrepTask, Station } from '@/types/database';

interface StationOverviewCardProps {
    station: Station;
    tasks: PrepTask[];
}

/**
 * Station summary card for the kitchen overview page.
 * Displays station name, progress bar, and task counts.
 * Extracted from kitchen/page.tsx.
 */
export function StationOverviewCard({
    station,
    tasks,
}: StationOverviewCardProps) {
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const pct =
        tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

    return (
        <Link
            href={`/kitchen/${station.id}`}
            className="group relative rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-slate-600 hover:bg-slate-900 active:scale-[0.98] animate-slide-up"
            aria-label={`${station.name} station — ${pct}% complete`}
        >
            {/* Color bar */}
            <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                style={{ backgroundColor: station.color }}
            />

            <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold">{station.name}</h2>
                <span
                    className="text-2xl font-bold"
                    style={{ color: station.color }}
                >
                    {pct}%
                </span>
            </div>

            <Progress value={pct} className="h-2 mb-4 bg-slate-800" />

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
                <p className="text-xs text-slate-500">No tasks</p>
            )}
        </Link>
    );
}
