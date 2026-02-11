'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import { useMenuItems } from '@/hooks/use-menu-items';
import { DAY_SHORT } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface ParRow {
    menu_item_id: string;
    day_of_week: number;
    par_quantity: number;
}

export default function ParLevelsPage() {
    const { data: items } = useMenuItems();
    const supabase = createClient();

    const { data: pars, isLoading } = useQuery<ParRow[]>({
        queryKey: ['par-levels'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('par_levels')
                .select('menu_item_id, day_of_week, par_quantity')
                .order('day_of_week');

            if (error) throw error;
            return data as ParRow[];
        },
    });

    // Build a lookup: itemId → { dayOfWeek → quantity }
    const parMap = new Map<string, Map<number, number>>();
    pars?.forEach((p) => {
        if (!parMap.has(p.menu_item_id)) {
            parMap.set(p.menu_item_id, new Map());
        }
        parMap.get(p.menu_item_id)!.set(p.day_of_week, p.par_quantity);
    });

    const todayDow = new Date().getDay();

    return (
        <div className="p-6 md:p-8 max-w-6xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Par Levels
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Target prep quantities per item, per day of week
                </p>
            </div>

            <div className="border rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="sticky left-0 bg-background z-10 min-w-[160px]">
                                Item
                            </TableHead>
                            {DAY_SHORT.map((day, i) => (
                                <TableHead
                                    key={day}
                                    className={`text-center min-w-[64px] ${i === todayDow ? 'bg-accent/10 font-bold text-accent' : ''}`}
                                >
                                    {day}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading &&
                            Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-28" />
                                    </TableCell>
                                    {DAY_SHORT.map((d) => (
                                        <TableCell
                                            key={d}
                                            className="text-center"
                                        >
                                            <Skeleton className="h-4 w-8 mx-auto" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}

                        {items?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="sticky left-0 bg-background font-medium">
                                    <div className="flex items-center gap-2">
                                        {item.station && (
                                            <div
                                                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                                style={{
                                                    backgroundColor:
                                                        item.station.color,
                                                }}
                                            />
                                        )}
                                        {item.name}
                                    </div>
                                </TableCell>
                                {DAY_SHORT.map((_, dow) => {
                                    const qty =
                                        parMap.get(item.id)?.get(dow) ?? null;
                                    return (
                                        <TableCell
                                            key={dow}
                                            className={`text-center tabular-nums ${dow === todayDow ? 'bg-accent/5 font-semibold' : ''}`}
                                        >
                                            {qty !== null ? (
                                                qty
                                            ) : (
                                                <span className="text-muted-foreground/40">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
