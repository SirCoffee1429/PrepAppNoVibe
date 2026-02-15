import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/status-badge';
import { StationBadge } from '@/components/station-badge';
import { StatCard } from '@/components/stat-card';
import { EmptyState } from '@/components/layout/empty-state';
import { PageHeader } from '@/components/layout/page-header';

// ─── StatusBadge ───────────────────────────────────────────────

describe('StatusBadge', () => {
    it.each([
        ['pending', 'Pending'],
        ['in_progress', 'In Progress'],
        ['done', 'Done'],
        ['skipped', 'Skipped'],
    ] as const)('renders "%s" as "%s"', (status, label) => {
        render(<StatusBadge status={status} />);
        expect(screen.getByText(label)).toBeInTheDocument();
    });
});

// ─── StationBadge ──────────────────────────────────────────────

describe('StationBadge', () => {
    it('renders station name', () => {
        render(
            <StationBadge station={{ name: 'Grill', color: '#ef4444' }} />
        );
        expect(screen.getByText('Grill')).toBeInTheDocument();
    });

    it('applies station color as border color', () => {
        const { container } = render(
            <StationBadge station={{ name: 'Prep', color: '#22c55e' }} />
        );
        const badge = container.firstElementChild as HTMLElement;
        // jsdom normalizes hex to rgb, so check the style attribute string
        expect(badge.getAttribute('style')).toContain('border-color');
    });
});

// ─── StatCard ──────────────────────────────────────────────────

describe('StatCard', () => {
    it('renders label and value', () => {
        render(<StatCard label="Total Tasks" value={42} />);
        expect(screen.getByText('Total Tasks')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('shows skeleton when loading', () => {
        const { container } = render(
            <StatCard label="Total" value={0} isLoading />
        );
        // Skeleton is a div, not the value
        expect(screen.queryByText('0')).not.toBeInTheDocument();
        expect(container.querySelector('[class*="animate-pulse"]')).toBeTruthy();
    });
});

// ─── EmptyState ────────────────────────────────────────────────

describe('EmptyState', () => {
    it('renders title and description', () => {
        render(
            <EmptyState
                title="Nothing here"
                description="Check back later"
            />
        );
        expect(screen.getByText('Nothing here')).toBeInTheDocument();
        expect(screen.getByText('Check back later')).toBeInTheDocument();
    });

    it('renders optional action', () => {
        render(
            <EmptyState
                title="Empty"
                action={<button>Add item</button>}
            />
        );
        expect(screen.getByText('Add item')).toBeInTheDocument();
    });

    it('renders without description or action', () => {
        render(<EmptyState title="No data" />);
        expect(screen.getByText('No data')).toBeInTheDocument();
    });
});

// ─── PageHeader ────────────────────────────────────────────────

describe('PageHeader', () => {
    it('renders title', () => {
        render(<PageHeader title="Dashboard" />);
        expect(
            screen.getByRole('heading', { name: 'Dashboard' })
        ).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(
            <PageHeader title="Menu" description="Active menu items" />
        );
        expect(screen.getByText('Active menu items')).toBeInTheDocument();
    });

    it('renders action slot', () => {
        render(
            <PageHeader
                title="Prep"
                actions={<button>Generate</button>}
            />
        );
        expect(screen.getByText('Generate')).toBeInTheDocument();
    });
});
