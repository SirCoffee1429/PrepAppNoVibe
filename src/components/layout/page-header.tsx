import { cn } from '@/lib/utils';

interface PageHeaderProps {
    /** Page title */
    title: string;
    /** Optional description beneath the title */
    description?: string;
    /** Right-side action slot (buttons, date pickers, etc.) */
    actions?: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Reusable page header with title, optional description, and action slot.
 * Used across all admin pages for consistent spacing and layout.
 */
export function PageHeader({
    title,
    description,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                'flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4',
                className
            )}
        >
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-muted-foreground text-sm mt-1">
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}
