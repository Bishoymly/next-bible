import Link from "next/link";
import type { ReactNode } from "react";

import { UtilityHeader } from "@/components/utility-header";

export function ReaderPage({
  title,
  description,
  label,
  actions,
  children,
  wide = false,
  compactTitle = false,
}: {
  title: string;
  description?: string;
  label?: string;
  actions?: ReactNode;
  children: ReactNode;
  wide?: boolean;
  compactTitle?: boolean;
}) {
  return (
    <div className="bible-reader-app reader-site-page">
      <UtilityHeader />
      <main
        className={`reader-page-main ${wide ? "reader-page-main-wide" : ""} ${compactTitle ? "reader-page-compact-title" : ""}`}
      >
        <header className="reader-page-intro">
          {label ? <p className="reader-page-label">{label}</p> : null}
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
          {actions ? <div className="reader-page-actions">{actions}</div> : null}
        </header>
        {children}
      </main>
      <ReaderPageFooter />
    </div>
  );
}

export function ReaderPageFooter() {
  return (
    <footer className="reader-page-footer">
      <p>Bible reading and study, without an account.</p>
      <nav aria-label="Footer navigation">
        <Link href="/translations">Text sources</Link>
        <Link href="/start">Start here</Link>
        <Link href="/gospel">The gospel</Link>
      </nav>
    </footer>
  );
}
