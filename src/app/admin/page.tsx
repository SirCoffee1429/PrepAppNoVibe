'use client';

import { useMemo, useState } from 'react';
import { useMenuItems } from '@/hooks/use-menu-items';
import { usePrepList } from '@/hooks/use-prep-list';
import { useStations } from '@/hooks/use-stations';
import { generatePrepList } from '@/app/actions/prep';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

function todayString() {
    return new Date().toISOString().slice(0, 10);
}

export default function AdminDashboard() {
    const today = todayString();
    const { data: prepList, isLoading: listLoading, refetch } = usePrepList(today);
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
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </p>
                </div>
                <Button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="bg-accent hover:bg-accent/90 text-white"
                >
                    {generating ? 'Generating…' : "Generate Today's Prep"}
                </Button>
            </div>

            {/* Stats row */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs">
                            Total Tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {listLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <p className="text-3xl font-bold">
                                {stats.total}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs">
                            Completed
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {listLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <p className="text-3xl font-bold text-emerald-500">
                                {stats.done}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs">
                            In Progress
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {listLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <p className="text-3xl font-bold text-amber-500">
                                {stats.inProgress}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs">
                            Pending
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {listLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <p className="text-3xl font-bold text-muted-foreground">
                                {stats.pending}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Progress */}
            {prepList && stats.total > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Today&apos;s Progress
                        </CardTitle>
                        <CardDescription>
                            {stats.pct}% complete
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={stats.pct} className="h-3" />
                    </CardContent>
                </Card>
            )}

            {/* Quick info */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
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
                                <Badge
                                    key={s.id}
                                    variant="outline"
                                    className="text-xs"
                                    style={{
                                        borderColor: s.color,
                                        color: s.color,
                                    }}
                                >
                                    {s.name}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Kitchen View
                        </CardTitle>
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
