'use client';

import { useState } from 'react';
import { usePrepList } from '@/hooks/use-prep-list';
import { generatePrepList } from '@/app/actions/prep';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-slate-100 text-slate-600',
    in_progress: 'bg-amber-100 text-amber-700',
    done: 'bg-emerald-100 text-emerald-700',
    skipped: 'bg-rose-100 text-rose-600',
};

function todayString() {
    return new Date().toISOString().slice(0, 10);
}

export default function PrepListPage() {
    const [date, setDate] = useState(todayString());
    const { data: prepList, isLoading, refetch } = usePrepList(date);
    const [generating, setGenerating] = useState(false);

    const tasks = prepList?.prep_tasks ?? [];
    const totalDone = tasks.filter((t) => t.status === 'done').length;
    const pct = tasks.length > 0 ? Math.round((totalDone / tasks.length) * 100) : 0;

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
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Prep Lists
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Generate and view daily prep lists
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-auto"
                    />
                    <Button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="bg-accent hover:bg-accent/90 text-white whitespace-nowrap"
                    >
                        {generating ? 'Generating…' : 'Generate'}
                    </Button>
                </div>
            </div>

            {/* Summary card */}
            {prepList && tasks.length > 0 && (
                <Card>
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

            {/* Tasks table */}
            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : tasks.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Station</TableHead>
                                <TableHead className="text-center">
                                    Needed
                                </TableHead>
                                <TableHead className="text-center">
                                    Done
                                </TableHead>
                                <TableHead className="text-center">
                                    Status
                                </TableHead>
                                <TableHead className="text-right">
                                    Progress
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
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
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                    style={{
                                                        borderColor:
                                                            task.menu_item
                                                                .station.color,
                                                        color: task.menu_item
                                                            .station.color,
                                                    }}
                                                >
                                                    {
                                                        task.menu_item.station
                                                            .name
                                                    }
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center tabular-nums">
                                            {task.quantity_needed}
                                        </TableCell>
                                        <TableCell className="text-center tabular-nums">
                                            {task.quantity_done}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span
                                                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[task.status] ?? ''}`}
                                            >
                                                {task.status.replace('_', ' ')}
                                            </span>
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
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <Card className="py-12">
                    <CardContent className="text-center text-muted-foreground">
                        <p className="text-lg mb-2">No prep list for this date</p>
                        <p className="text-sm">
                            Click &quot;Generate&quot; to create tasks from par
                            levels
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
