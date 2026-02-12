'use client';

import { useMemo, useState } from 'react';
import { useMenuItems } from '@/hooks/use-menu-items';
import { usePrepList } from '@/hooks/use-prep-list';
import { useStations } from '@/hooks/use-stations';
import { generatePrepList } from '@/app/actions/prep';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/stat-card';
import { ProgressCard } from '@/components/progress-card';
import { StationBadge } from '@/components/station-badge';

function todayString() {
    return new Date().toISOString().slice(0, 10);
}

export default function AdminDashboard() {
    const today = todayString();
    const {
        data: prepList,
        isLoading: listLoading,
        refetch,
    } = usePrepList(today);
    const { data: menuItems } = useMenuItems();
    const { data: stations } = useStations();
    const [generating, setGenerating] = useState(false);

    const stats = useMemo(() => {
        const tasks = prepList?.prep_tasks ?? [];
        const total = tasks.length;
        const done = tasks.filter((t) => t.status === 'done').length;
        const inProgress = tasks.filter(
            (t) => t.status === 'in_progress'
        ).length;
        const pending = tasks.filter((t) => t.status === 'pending').length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        return { total, done, inProgress, pending, pct };
    }, [prepList]);

    async function handleGenerate() {
        setGenerating(true);
        try {
            const result = await generatePrepList(today);
            toast.success(`Prep list generated — ${result.taskCount} tasks`);
            refetch();
        } catch (err) {
            toast.error('Failed to generate', {
                description:
                    err instanceof Error ? err.message : 'Unknown error',
            });
        } finally {
            setGenerating(false);
        }
    }

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-6xl">
            <PageHeader
                title="Dashboard"
                description={new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                })}
                actions={
                    <Button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="bg-accent hover:bg-accent/90 text-white"
                    >
                        {generating
                            ? 'Generating…'
                            : "Generate Today's Prep"}
                    </Button>
                }
            />

            {/* Stats row */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Tasks"
                    value={stats.total}
                    isLoading={listLoading}
                />
                <StatCard
                    label="Completed"
                    value={stats.done}
                    valueClassName="text-emerald-500"
                    isLoading={listLoading}
                />
                <StatCard
                    label="In Progress"
                    value={stats.inProgress}
                    valueClassName="text-amber-500"
                    isLoading={listLoading}
                />
                <StatCard
                    label="Pending"
                    value={stats.pending}
                    valueClassName="text-muted-foreground"
                    isLoading={listLoading}
                />
            </div>

            {/* Progress */}
            {prepList && stats.total > 0 && (
                <ProgressCard
                    title="Today's Progress"
                    description={`${stats.pct}% complete`}
                    value={stats.pct}
                />
            )}

            {/* Quick info */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="animate-slide-up">
                    <CardHeader>
                        <CardTitle className="text-lg">Menu Items</CardTitle>
                        <CardDescription>
                            Active items across all stations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold mb-3">
                            {menuItems?.length ?? '—'}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {stations?.map((s) => (
                                <StationBadge key={s.id} station={s} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="animate-slide-up">
                    <CardHeader>
                        <CardTitle className="text-lg">Kitchen View</CardTitle>
                        <CardDescription>
                            Share this link with your kitchen crew
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <code className="text-sm bg-muted px-3 py-2 rounded-md block">
                            /kitchen
                        </code>
                        <p className="text-xs text-muted-foreground mt-2">
                            No login required — cooks can access directly
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
