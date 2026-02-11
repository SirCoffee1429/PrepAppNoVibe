'use client';

import { useMenuItems } from '@/hooks/use-menu-items';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function MenuItemsPage() {
    const { data: items, isLoading } = useMenuItems();

    return (
        <div className="p-6 md:p-8 max-w-6xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Menu Items
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    All active items linked to stations and recipes
                </p>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Station</TableHead>
                            <TableHead>Recipe</TableHead>
                            <TableHead className="text-right">Unit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-28" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-4 w-16 ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))}

                        {items?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.name}
                                </TableCell>
                                <TableCell>
                                    {item.station && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-medium"
                                            style={{
                                                borderColor:
                                                    item.station.color,
                                                color: item.station.color,
                                                backgroundColor: `${item.station.color}10`,
                                            }}
                                        >
                                            {item.station.name}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {item.recipe?.name ?? '—'}
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {item.unit}
                                </TableCell>
                            </TableRow>
                        ))}

                        {!isLoading && items?.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center text-muted-foreground py-8"
                                >
                                    No menu items found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
