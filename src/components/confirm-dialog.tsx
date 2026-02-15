'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
    /** The element that triggers the dialog */
    trigger: React.ReactNode;
    /** Dialog title */
    title: string;
    /** Dialog description */
    description: string;
    /** Confirm button label */
    confirmLabel?: string;
    /** Cancel button label */
    cancelLabel?: string;
    /** Called when user confirms */
    onConfirm: () => void;
    /** Whether the action is destructive (red styling) */
    destructive?: boolean;
}

/**
 * Reusable confirmation dialog wrapping AlertDialog with sensible defaults.
 * Supports destructive variant for delete actions.
 */
export function ConfirmDialog({
    trigger,
    title,
    description,
    confirmLabel = 'Continue',
    cancelLabel = 'Cancel',
    onConfirm,
    destructive = false,
}: ConfirmDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={cn(
                            destructive &&
                            'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        )}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
