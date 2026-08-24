"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";

const key = "bible.bishoy.io.library.v1";

type BookmarkEntry = string | { reference: string; label?: string; text?: string };
type Data = {
  schemaVersion: 1;
  bookmarks: BookmarkEntry[];
  notes: Record<string, string>;
};

const empty: Data = { schemaVersion: 1, bookmarks: [], notes: {} };

export function LocalLibrary() {
  const [data, setData] = useState<Data>(empty);

  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "");
      if (value?.schemaVersion === 1) setData({ ...empty, ...value });
    } catch {}
  }, []);

  const save = (next: Data) => {
    setData(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const references = [
    ...new Set([
      ...data.bookmarks.map((item) =>
        typeof item === "string" ? item : item.reference
      ),
      ...Object.keys(data.notes),
    ]),
  ];

  if (!references.length) {
    return (
      <section className="reader-empty-state reader-library-empty">
        <Bookmark aria-hidden="true" />
        <h2>No saved verses yet</h2>
        <p>
          Bookmark a verse in the reader and it will appear here on this
          device.
        </p>
        <Link className="reader-button reader-button-primary" href="/bsb/john/1">
          Open the Bible
        </Link>
      </section>
    );
  }

  return (
    <section className="reader-local-library">
      <div className="reader-library-list">
        {references.map((reference) => {
          const bookmark = data.bookmarks.find(
            (item) =>
              (typeof item === "string" ? item : item.reference) === reference
          );
          const parts = reference.split(":");
          const label =
            typeof bookmark === "string" || !bookmark
              ? reference.replaceAll(":", " ")
              : bookmark.label;
          const verse = parts[3];

          return (
            <article key={reference} className="reader-library-entry">
              <div className="reader-library-entry-heading">
                <Link href={`/${parts.slice(0, 3).join("/")}#${verse}`}>
                  {label}
                </Link>
                <button
                  type="button"
                  aria-label={`Remove ${label}`}
                  onClick={() =>
                    save({
                      ...data,
                      bookmarks: data.bookmarks.filter(
                        (item) =>
                          (typeof item === "string" ? item : item.reference) !==
                          reference
                      ),
                      notes: Object.fromEntries(
                        Object.entries(data.notes).filter(
                          ([item]) => item !== reference
                        )
                      ),
                    })
                  }
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
              {typeof bookmark !== "string" && bookmark?.text ? (
                <blockquote>{bookmark.text}</blockquote>
              ) : null}
              <label htmlFor={`note-${reference}`}>Private note</label>
              <textarea
                id={`note-${reference}`}
                value={data.notes[reference] || ""}
                onChange={(event) =>
                  save({
                    ...data,
                    notes: { ...data.notes, [reference]: event.target.value },
                  })
                }
                placeholder="Write a note for this passage"
              />
            </article>
          );
        })}
      </div>
      <button
        type="button"
        className="reader-library-clear"
        onClick={() => {
          if (confirm("Clear all saved bookmarks and notes from this browser?")) {
            localStorage.removeItem(key);
            setData(empty);
          }
        }}
      >
        <Trash2 aria-hidden="true" />
        Clear local library
      </button>
    </section>
  );
}
