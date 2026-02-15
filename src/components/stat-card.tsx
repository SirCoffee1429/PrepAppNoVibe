import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatCardProps {
    /** Label above the value */
    label: string;
    /** Display value (number or string) */
    value: React.ReactNode;
    /** Optional color class for the value text */
    valueClassName?: string;
    /** Show loading skeleton */
    isLoading?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Compact stat card for dashboard KPIs.
 * Replaces the 4x duplicated stat pattern on admin/page.tsx.
 */
export function StatCard({
    label,
    value,
    valueClassName,
    isLoading = false,
    className,
}: StatCardProps) {
    return (
        <Card className={cn('animate-slide-up', className)}>
            <CardHeader className="pb-2">
                <CardDescription className="text-xs">{label}</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                ) : (
                    <p className={cn('text-3xl font-bold', valueClassName)}>
                        {value}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
