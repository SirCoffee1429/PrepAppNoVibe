import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
    /** Card heading */
    title: string;
    /** Description/subtitle */
    description?: string;
    /** Progress percentage (0-100) */
    value: number;
    /** Height class for the progress bar */
    barHeight?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Card with a title, description, and a progress bar.
 * Used on admin dashboard and prep list pages.
 */
export function ProgressCard({
    title,
    description,
    value,
    barHeight = 'h-3',
    className,
}: ProgressCardProps) {
    return (
        <Card className={cn('animate-slide-up', className)}>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <Progress value={value} className={barHeight} />
            </CardContent>
        </Card>
    );
}
