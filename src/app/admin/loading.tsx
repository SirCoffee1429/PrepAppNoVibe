import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
    return (
        <div className="p-6 md:p-8 space-y-6 max-w-6xl animate-pulse-subtle">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-lg" />
                ))}
            </div>
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
        </div>
    );
}
