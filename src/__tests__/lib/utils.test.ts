import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn()', () => {
    it('merges class names', () => {
        expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
    });

    it('resolves Tailwind conflicts (last wins)', () => {
        expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('handles conditional classes', () => {
        expect(cn('base', false && 'hidden', 'end')).toBe('base end');
    });

    it('handles undefined and null', () => {
        expect(cn('base', undefined, null, 'end')).toBe('base end');
    });

    it('returns empty string with no args', () => {
        expect(cn()).toBe('');
    });
});
