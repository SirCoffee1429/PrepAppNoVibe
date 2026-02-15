import { cn } from '@/lib/utils';

/**
 * Screen-reader-first skip-to-main-content link.
 * Visually hidden until focused — keyboard users can tab to it
 * to jump past navigation directly to main content.
 */
export function SkipLink() {
    return (
        <a
            href="#main-content"
            className={cn(
                'sr-only focus:not-sr-only',
                'fixed top-2 left-2 z-[100]',
                'bg-accent text-white px-4 py-2 rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-accent/50',
                'text-sm font-medium'
            )}
        >
            Skip to main content
        </a>
    );
}
