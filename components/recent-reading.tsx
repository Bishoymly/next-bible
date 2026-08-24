"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, History } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const RECENT_READING_KEY = "bible-reader.recent-locations.v1";
const RECENT_READING_EVENT = "bible-reader:recent-reading-updated";
const MAX_RECENT_BOOKS = 5;

type RecentLocation = {
  version: string;
  book: string;
  bookId?: string;
  chapter: number;
  label: string;
  href: string;
  visitedAt: number;
};

function isRecentLocation(value: unknown): value is RecentLocation {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<RecentLocation>;
  return (
    typeof item.version === "string" &&
    typeof item.book === "string" &&
    (item.bookId === undefined || typeof item.bookId === "string") &&
    typeof item.chapter === "number" &&
    Number.isFinite(item.chapter) &&
    typeof item.label === "string" &&
    typeof item.href === "string" &&
    item.href.startsWith("/") &&
    typeof item.visitedAt === "number"
  );
}

function sameBook(first: RecentLocation, second: RecentLocation) {
  return (
    first.book === second.book ||
    Boolean(first.bookId && second.bookId && first.bookId === second.bookId)
  );
}

function keepLatestChapterPerBook(locations: RecentLocation[]) {
  const unique: RecentLocation[] = [];

  for (const location of locations) {
    if (!unique.some((item) => sameBook(item, location))) {
      unique.push(location);
    }
    if (unique.length === MAX_RECENT_BOOKS) break;
  }

  return unique;
}

function readRecentLocations(): RecentLocation[] {
  try {
    const stored = window.localStorage.getItem(RECENT_READING_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed)
      ? keepLatestChapterPerBook(parsed.filter(isRecentLocation))
      : [];
  } catch {
    return [];
  }
}

function useRecentLocations() {
  const [locations, setLocations] = useState<RecentLocation[]>([]);

  useEffect(() => {
    const refresh = () => setLocations(readRecentLocations());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(RECENT_READING_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(RECENT_READING_EVENT, refresh);
    };
  }, []);

  return locations;
}

export function RecentReadingTracker({
  version,
  book,
  bookId,
  bookName,
  chapter,
}: {
  version: string;
  book: string;
  bookId: string;
  bookName: string;
  chapter: number;
}) {
  useEffect(() => {
    const location: RecentLocation = {
      version,
      book,
      bookId,
      chapter,
      label: `${bookName} ${chapter}`,
      href: `/${version}/${book}/${chapter}`,
      visitedAt: Date.now(),
    };
    const next = [
      location,
      ...readRecentLocations().filter((item) => !sameBook(item, location)),
    ].slice(0, MAX_RECENT_BOOKS);

    try {
      window.localStorage.setItem(RECENT_READING_KEY, JSON.stringify(next));
      queueMicrotask(() =>
        window.dispatchEvent(new Event(RECENT_READING_EVENT)),
      );
    } catch {
      // Reading still works when storage is unavailable.
    }
  }, [book, bookId, bookName, chapter, version]);

  return null;
}

export function RecentReadingMenu() {
  const locations = useRecentLocations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="reader-recent-trigger"
          type="button"
          aria-label="Open recent chapters"
          title="Recent chapters"
        >
          <History aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="reader-recent-menu"
      >
        <DropdownMenuLabel className="reader-recent-menu-label">
          Recent chapters
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locations.length ? (
          locations.map((location) => (
            <DropdownMenuItem
              asChild
              key={location.href}
              className="reader-recent-menu-item"
            >
              <Link href={location.href}>
                <span>
                  <strong>{location.label}</strong>
                  <small>{location.version.toUpperCase()}</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="reader-recent-menu-empty">
            Chapters you read will appear here.
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="reader-recent-menu-item">
          <Link href="/bsb">
            <span>
              <strong>Browse all books</strong>
              <small>Berean Standard Bible</small>
            </span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RecentReadingList() {
  const locations = useRecentLocations();

  return (
    <section
      className="home-reader-recents"
      aria-labelledby="recent-reading-title"
    >
      <div className="home-reader-section-heading">
        <p>Continue reading</p>
        <h2 id="recent-reading-title">Your recent chapters</h2>
      </div>
      {locations.length ? (
        <div className="home-reader-recent-list">
          {locations.slice(0, 4).map((location) => (
            <Link key={location.href} href={location.href}>
              <Clock3 aria-hidden="true" />
              <span>
                <strong>{location.label}</strong>
                <small>{location.version.toUpperCase()}</small>
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="home-reader-recent-empty">
          <p>
            Chapters you open will be kept here on this device. Nothing is
            sent to an account or server.
          </p>
          <Link href="/bsb/john/1">
            Begin with John
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
