'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export function ToasterProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // On the server, or before the first client render, do not render anything
  }

  return <Toaster position="top-center" reverseOrder={false} />;
}