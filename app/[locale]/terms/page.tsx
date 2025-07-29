import { PageLayout } from '@/components/layout/PageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using the GaoMotion application.',
};

export default function TermsOfServicePage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <PageLayout>
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <article className="prose dark:prose-invert max-w-none">
          <h1>Terms of Service</h1>
          <p>Last updated: {lastUpdated}</p>

          <h2>1. Agreement to Terms</h2>
          <p>
            By using our application, GaoMotion, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
          </p>

          <h2>2. Use of the Application</h2>
          <p>
            GaoMotion is provided for the purpose of creating motion capture data from video sources. You agree to use the application responsibly and not for any unlawful purpose.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            The application and its original content, features, and functionality are and will remain the exclusive property of GaoMotion and its licensors. The motion capture data you generate is your own property.
          </p>
        </article>
      </div>
    </PageLayout>
  );
}