import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
                <div className="text-7xl font-bold text-muted-foreground/30">
                    404
                </div>
                <h1 className="text-2xl font-bold">Page not found</h1>
                <p className="text-muted-foreground text-sm">
                    The page you&apos;re looking for doesn&apos;t exist or has
                    been moved.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button asChild className="bg-accent hover:bg-accent/90 text-white">
                        <Link href="/">Home</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin">Admin</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/kitchen">Kitchen</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
