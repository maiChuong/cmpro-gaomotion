'use client';

import { useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-red-500">Something went wrong!</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          An unexpected error has occurred. Please try again.
        </p>
        <div className="mt-8 flex gap-4">
          <Button onClick={() => reset()} variant="outline">
            Try again
          </Button>
          <Button href="/">Go back to Home</Button>
        </div>
      </div>
    </PageLayout>
  );
}