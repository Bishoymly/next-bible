"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const prevPathnameRef = useRef<string | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip animation on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    // Only animate if pathname actually changed
    if (prevPathnameRef.current !== pathname) {
      // Determine direction based on pathname comparison
      // For chapter navigation, compare chapter numbers
      const currentMatch = pathname.match(/\/(\d+)$/);
      const prevMatch = prevPathnameRef.current?.match(/\/(\d+)$/);
      
      if (currentMatch && prevMatch) {
        const currentChapter = parseInt(currentMatch[1]);
        const prevChapter = parseInt(prevMatch[1]);
        setDirection(currentChapter > prevChapter ? "forward" : "backward");
      } else {
        // Default to forward for other navigations
        setDirection("forward");
      }
      
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  return (
    <div className={`page-transition-wrapper ${direction === "backward" ? "backward" : ""}`}>
      {children}
    </div>
  );
}

