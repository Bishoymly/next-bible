'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function VersionNotFound() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Extract the version from the path
    const pathParts = pathname.split('/').filter(Boolean);
    
    if (pathParts.length > 0) {
      const version = pathParts[0]; // First part of the path
      
      // Redirect to the version's homepage
      router.replace(`/${version}`);
    } else {
      // Fallback to homepage
      router.replace('/');
    }
  }, [pathname, router]);

  // This component won't be rendered as we're redirecting immediately
  return null;
} 