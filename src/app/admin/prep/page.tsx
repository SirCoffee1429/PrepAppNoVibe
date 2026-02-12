'use client';

import { useState } from 'react';
import { usePrepList } from '@/hooks/use-prep-list';
import { generatePrepList } from '@/app/actions/prep';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { TableCell, TableRow } from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/layout/empty-state';
import { DataTable } from '@/components/data-table';
import { StationBadge } from '@/components/station-badge';
import { StatusBadge } from '@/components/status-badge';

const COLUMNS = [
    { header: 'Item', skeletonWidth: 'w-28' },
    { header: 'Station', skeletonWidth: 'w-20' },
    { header: 'Needed', headerClassName: 'text-center', skeletonWidth: 'w-12' },
    { header: 'Done', headerClassName: 'text-center', skeletonWidth: 'w-12' },
    { header: 'Status', headerClassName: 'text-center', skeletonWidth: 'w-16' },
    { header: 'Progress', headerClassName: 'text-right', skeletonWidth: 'w-20' },
];

function todayString() {
    return new Date().toISOString().slice(0, 10);
}

export default function PrepListPage() {
    const [date, setDate] = useState(todayString());
    const { data: prepList, isLoading, refetch } = usePrepList(date);
    const [generating, setGenerating] = useState(false);

    const tasks = prepList?.prep_tasks ?? [];
    const totalDone = tasks.filter((t) => t.status === 'done').length;
    const pct =
        tasks.length > 0 ? Math.round((totalDone / tasks.length) * 100) : 0;

    async function handleGenerate() {
        setGenerating(true);
        try {
            const result = await generatePrepList(date);
            toast.success(`Generated ${result.taskCount} tasks`);
            refetch();
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : 'Generation failed'
            );
        } finally {
            setGenerating(false);
        }
    }

    return (
        <div className="p-6 md:p-8 max-w-6xl space-y-6">
            <PageHeader
                title="Prep Lists"
                description="Generate and view daily prep lists"
                actions={
                    <>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-auto"
                            aria-label="Select prep date"
                        />
                        <Button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="bg-accent hover:bg-accent/90 text-white whitespace-nowrap"
                        >
                            {generating ? 'Generating…' : 'Generate'}
                        </Button>
                    </>
                }
            />

            {/* Summary card */}
            {prepList && tasks.length > 0 && (
                <Card className="animate-slide-up">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    {new Date(
                                        date + 'T12:00:00'
                                    ).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </CardTitle>
                                <CardDescription>
                                    {tasks.length} tasks · {pct}% complete
                                </CardDescription>
                            </div>
                            {prepList.is_locked && (
                                <Badge variant="outline" className="text-xs">
                                    🔒 Locked
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Progress value={pct} className="h-2" />
                    </CardContent>
                </Card>
            )}

            {/* Tasks table or empty state */}
            {!isLoading && tasks.length === 0 ? (
                <Card className="py-4">
                    <CardContent>
                        <EmptyState
                            title="No prep list for this date"
                            description='Click "Generate" to create tasks from par levels'
                        />
                    </CardContent>
                </Card>
            ) : (
                <DataTable
                    columns={COLUMNS}
                    isLoading={isLoading}
                    isEmpty={false}
                >
                    {tasks.map((task) => {
                        const taskPct =
                            task.quantity_needed > 0
                                ? Math.round(
                                    (task.quantity_done /
                                        task.quantity_needed) *
                                    100
                                )
                                : 0;
                        return (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium">
                                    {task.menu_item?.name ?? '—'}
                                </TableCell>
                                <TableCell>
                                    {task.menu_item?.station && (
                                        <StationBadge
                                            station={task.menu_item.station}
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                    {task.quantity_needed}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                    {task.quantity_done}
                                </TableCell>
                                <TableCell className="text-center">
                                    <StatusBadge status={task.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Progress
                                            value={taskPct}
                                            className="h-1.5 w-16"
                                        />
                                        <span className="text-xs text-muted-foreground tabular-nums w-8">
                                            {taskPct}%
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </DataTable>
            )}
        </div>
    );
}
