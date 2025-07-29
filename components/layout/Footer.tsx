'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full border-t bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} GaoMotion. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Contact
          </Link>
          <Link
            href="/terms"
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Privacy Policy
          </Link>
          <Link
            href="https://github.com/mai-space/cmpro-gaomotion" // Placeholder link
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}