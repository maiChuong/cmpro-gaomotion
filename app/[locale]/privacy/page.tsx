import { PageLayout } from '@/components/layout/PageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn about how GaoMotion handles your data and respects your privacy. All processing is done locally on your device.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <PageLayout>
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <article className="prose dark:prose-invert max-w-none">
          <h1>Privacy Policy</h1>
          <p>Last updated: {lastUpdated}</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to GaoMotion. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. All processing is done locally on your device.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect via the Application includes:
          </p>
          <ul>
            <li><strong>Video and Motion Data:</strong> We process video streams from your camera or uploaded video files locally on your device to generate motion capture data. This data is not sent to our servers unless you explicitly use the live-sync feature to connect to your own local Blender instance.</li>
            <li><strong>Configuration Data:</strong> We store your settings, such as the selected rig and tunnel URL, in your browser's local storage. This information is never sent to our servers.</li>
          </ul>

          <h2>3. Use of Your Information</h2>
          <p>
            We use the collected data solely to provide and operate the application's features, such as enabling motion capture, saving your preferences, and transmitting data to your local Blender instance via the tunnel URL you provide.
          </p>

          <h2>4. Security of Your Information</h2>
          <p>
            Since all data is processed and stored on your local device, you are in control of its security. We do not have access to your video or motion data.
          </p>
        </article>
      </div>
    </PageLayout>
  );
}
