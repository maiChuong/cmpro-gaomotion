'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">{children}</main>
      <Footer />
    </div>
  );
}