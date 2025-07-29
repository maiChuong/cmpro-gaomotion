'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200">404</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
          Oops! The page you're looking for could not be found.
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-500">
          It might have been moved or deleted.
        </p>
        <Button href="/" className="mt-8">
          Go back to Home
        </Button>
      </div>
    </PageLayout>
  );
}