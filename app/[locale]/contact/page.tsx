'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate an API call
    console.log({ name, email, message });
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Thank you for your message! We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <PageLayout>
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Have a question or feedback? Fill out the form below.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-input rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-input rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea id="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-input rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
          </div>
          <div>
            <Button type="submit" className="w-full" loading={isLoading}>
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}