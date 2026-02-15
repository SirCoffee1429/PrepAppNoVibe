import { Skeleton } from '@/components/ui/skeleton';

export default function KitchenLoading() {
    return (
        <div className="p-4 md:p-6 space-y-6 animate-pulse-subtle">
            <div className="flex justify-between items-baseline">
                <Skeleton className="h-7 w-36 bg-slate-800" />
                <Skeleton className="h-8 w-16 bg-slate-800" />
            </div>
            <Skeleton className="h-3 w-full bg-slate-800" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-40 rounded-xl bg-slate-800"
                    />
                ))}
            </div>
        </div>
    );
}
