"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { RecentReadingMenu } from "@/components/recent-reading";

const links = [
  ["/bsb", "Books"],
  ["/search", "Search"],
  ["/study", "Study"],
  ["/gospel", "Gospel"],
  ["/library", "Saved"],
] as const;

export function UtilityHeader() {
  const pathname = usePathname();

  return (
    <header className="reader-site-topbar">
      <div className="reader-site-topbar-inner">
        <Link href="/" className="reader-wordmark" aria-label="Bible home">
          Bible
        </Link>
        <nav className="reader-site-nav" aria-label="Main navigation">
          {links.map(([href, label]) => {
            const current = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={current ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="reader-site-actions">
          <RecentReadingMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
