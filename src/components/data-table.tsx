import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/layout/empty-state';
import { cn } from '@/lib/utils';

interface Column {
    /** Column header label */
    header: string;
    /** Optional header class (e.g. 'text-right', 'text-center') */
    headerClassName?: string;
    /** Width of the skeleton in loading state */
    skeletonWidth?: string;
}

interface DataTableProps {
    /** Column definitions */
    columns: Column[];
    /** Number of skeleton rows to show when loading */
    skeletonRows?: number;
    /** Whether data is loading */
    isLoading: boolean;
    /** Whether the data set is empty (after loading) */
    isEmpty: boolean;
    /** Message to display when empty */
    emptyMessage?: string;
    /** Empty state icon */
    emptyIcon?: React.ReactNode;
    /** The table body content (rendered rows) */
    children: React.ReactNode;
    /** Additional CSS classes for the wrapper */
    className?: string;
}

/**
 * Wrapper around Table with built-in loading skeletons and empty state.
 * Reduces boilerplate across menu, pars, and prep pages.
 */
export function DataTable({
    columns,
    skeletonRows = 5,
    isLoading,
    isEmpty,
    emptyMessage = 'No data found',
    emptyIcon,
    children,
    className,
}: DataTableProps) {
    return (
        <div className={cn('border rounded-lg overflow-hidden', className)}>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col, i) => (
                            <TableHead
                                key={i}
                                className={col.headerClassName}
                            >
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading &&
                        Array.from({ length: skeletonRows }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                                {columns.map((col, j) => (
                                    <TableCell
                                        key={j}
                                        className={col.headerClassName}
                                    >
                                        <Skeleton
                                            className={cn(
                                                'h-4',
                                                col.skeletonWidth ?? 'w-24',
                                                col.headerClassName?.includes(
                                                    'text-right'
                                                ) && 'ml-auto',
                                                col.headerClassName?.includes(
                                                    'text-center'
                                                ) && 'mx-auto'
                                            )}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                    {!isLoading && isEmpty && (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="py-0"
                            >
                                <EmptyState
                                    icon={emptyIcon}
                                    title={emptyMessage}
                                    className="py-8"
                                />
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && !isEmpty && children}
                </TableBody>
            </Table>
        </div>
    );
}
