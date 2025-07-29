import Link from 'next/link';
import { Button } from '@/components/ui/Button';

/**
 * A custom 404 Not Found page.
 * Next.js automatically renders this file when a route is not found.
 * https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="p-8 bg-card rounded-lg shadow-lg text-center max-w-md mx-auto">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          We can&apos;t seem to find the page you&apos;re looking for.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
