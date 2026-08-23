"use client";

import { useEffect, useState } from "react";

const key = "bible.bishoy.io.library.v1";
type Bookmark = string | { reference: string; label: string; text: string };
type Library = { schemaVersion: 1; bookmarks: Bookmark[]; notes: Record<string, string> };
function readLibrary(): Library { try { const value = JSON.parse(localStorage.getItem(key) ?? ""); if (value?.schemaVersion === 1 && Array.isArray(value.bookmarks) && value.notes && typeof value.notes === "object") return value; } catch {} return { schemaVersion: 1, bookmarks: [], notes: {} }; }

export function LocalVerseTools({ reference, label, text }: { reference: string; label: string; text: string }) {
  const [library, setLibrary] = useState<Library>({ schemaVersion: 1, bookmarks: [], notes: {} });
  useEffect(() => setLibrary(readLibrary()), []);
  function save(next: Library) { setLibrary(next); localStorage.setItem(key, JSON.stringify(next)); }
  const bookmarked = library.bookmarks.some((item) => (typeof item === "string" ? item : item.reference) === reference);
  return <div className="mt-5 space-y-3 border-t border-border pt-4"><button type="button" onClick={() => save({ ...library, bookmarks: bookmarked ? library.bookmarks.filter((item) => (typeof item === "string" ? item : item.reference) !== reference) : [...library.bookmarks, { reference, label, text }] })} className="rounded-md border border-border px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2">{bookmarked ? "Remove bookmark" : "Bookmark verse"}</button><label className="block text-sm font-medium" htmlFor={`note-${reference}`}>Private note</label><textarea id={`note-${reference}`} value={library.notes[reference] ?? ""} onChange={(event) => save({ ...library, notes: { ...library.notes, [reference]: event.target.value } })} placeholder="Saved only in this browser" className="min-h-24 w-full rounded-md border border-input bg-background p-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2" /></div>;
}
