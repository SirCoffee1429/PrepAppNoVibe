'use client';

import { useMenuItems } from '@/hooks/use-menu-items';
import { TableCell, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table';
import { StationBadge } from '@/components/station-badge';

const COLUMNS = [
    { header: 'Item', skeletonWidth: 'w-32' },
    { header: 'Station', skeletonWidth: 'w-20' },
    { header: 'Recipe', skeletonWidth: 'w-28' },
    { header: 'Unit', headerClassName: 'text-right', skeletonWidth: 'w-16' },
];

export default function MenuItemsPage() {
    const { data: items, isLoading } = useMenuItems();

    return (
        <div className="p-6 md:p-8 max-w-6xl space-y-6">
            <PageHeader
                title="Menu Items"
                description="All active items linked to stations and recipes"
            />

            <DataTable
                columns={COLUMNS}
                isLoading={isLoading}
                isEmpty={!items || items.length === 0}
                emptyMessage="No menu items found"
            >
                {items?.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">
                            {item.name}
                        </TableCell>
                        <TableCell>
                            {item.station && (
                                <StationBadge station={item.station} />
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
            </DataTable>
        </div>
    );
}
