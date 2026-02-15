import { Badge } from '@/components/ui/badge';
import type { Station } from '@/types/database';

interface StationBadgeProps {
    station: Pick<Station, 'name' | 'color'>;
    className?: string;
}

/**
 * Color-coded station badge. Used across admin dashboard, menu page,
 * prep list page, and kitchen pages. Centralizes the duplicated
 * inline-style pattern for station badges.
 */
export function StationBadge({ station, className }: StationBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={className ?? 'text-xs font-medium'}
            style={{
                borderColor: station.color,
                color: station.color,
                backgroundColor: `${station.color}10`,
            }}
        >
            {station.name}
        </Badge>
    );
}
