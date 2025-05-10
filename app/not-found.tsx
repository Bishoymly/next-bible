'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Extract the version from the path
    const pathParts = pathname.split('/').filter(Boolean);
    
    if (pathParts.length > 0) {
      const version = pathParts[0]; // First part of the path
      
      // If it's a known version, redirect to its homepage
      if (version === 'avd' || version === 'kjv') {
        router.replace(`/${version}`);
        return;
      }
    }
    
    // Default: redirect to the main page
    router.replace('/');
  }, [pathname, router]);

  // This component won't be rendered as we're redirecting immediately
  return null;
} 