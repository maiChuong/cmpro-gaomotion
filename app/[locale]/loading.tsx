import { PageLayout } from '@/components/layout/PageLayout';
import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  // This UI will be displayed as a fallback while the page content is loading.
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center gap-4">
        <Spinner className="h-8 w-8 text-blue-500" />
        <p className="text-gray-600 dark:text-gray-400">Loading Page...</p>
      </div>
    </PageLayout>
  );
}
