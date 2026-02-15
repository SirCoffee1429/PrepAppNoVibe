import { cn } from '@/lib/utils';

interface EmptyStateProps {
    /** Emoji or icon to display */
    icon?: React.ReactNode;
    /** Primary message */
    title: string;
    /** Secondary descriptive text */
    description?: string;
    /** Optional action button/link */
    action?: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Centralized empty state component with icon, title, description, and optional action.
 * Replaces ad-hoc empty states across kitchen, prep, and menu pages.
 */
export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-16 space-y-3 animate-fade-in',
                className
            )}
        >
            {icon && <div className="text-5xl">{icon}</div>}
            <p className="text-xl font-medium">{title}</p>
            {description && (
                <p className="text-sm text-muted-foreground max-w-sm text-center">
                    {description}
                </p>
            )}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
