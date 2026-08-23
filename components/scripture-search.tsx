"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Entry = { version: string; book: string; bookSlug: string; chapter: number; verse: number; text: string };
const indexes = new Map<string, Promise<Entry[]>>();
function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[ٱأإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ـ/g, "")
    .toLocaleLowerCase();
}
function loadIndex(version: string) {
  if (!indexes.has(version)) indexes.set(version, fetch(`/generated/scripture/search/${version}.json`).then(async (response) => {
    if (!response.ok) throw new Error("Search index could not be loaded.");
    return (await response.json()).entries as Entry[];
  }));
  return indexes.get(version)!;
}

export function ScriptureSearch() {
  const [version, setVersion] = useState("bsb");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Entry[]>([]);
  const [status, setStatus] = useState("Enter two or more characters to search this translation.");
  async function search(value = query, selectedVersion = version) {
    const terms = normalizeSearchText(value.trim()).split(/\s+/).filter(Boolean);
    if (terms.join("").length < 2) { setResults([]); setStatus("Enter two or more characters to search this translation."); return; }
    setStatus("Loading local search index...");
    try {
      const entries = await loadIndex(selectedVersion);
      const matches = entries.filter((entry) => { const text = normalizeSearchText(entry.text); return terms.every((term) => text.includes(term)); }).slice(0, 50);
      setResults(matches); setStatus(matches.length ? `${matches.length} matching verses` : "No verses matched this search.");
    } catch { setResults([]); setStatus("The local search index is unavailable. Please try again."); }
  }
  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
    if (initialQuery) { setQuery(initialQuery); void search(initialQuery, version); }
  // The URL is read once when the static search page hydrates.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <section className="mx-auto max-w-4xl space-y-4 rounded-xl border border-border bg-card p-5 sm:p-7">
    <form onSubmit={(event) => { event.preventDefault(); void search(); }} className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="translation">Translation</label>
      <select id="translation" value={version} onChange={(event) => { setVersion(event.target.value); setResults([]); setStatus("Ready to search this translation."); }} className="h-11 rounded-md border border-input bg-background px-3 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2">
        <option value="bsb">Berean Standard Bible</option><option value="asv">American Standard Version</option><option value="kjv">King James Version</option><option value="avd">Arabic Van Dyck</option>
      </select>
      <label className="sr-only" htmlFor="scripture-search">Search Scripture</label>
      <input id="scripture-search" dir="auto" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search exact words or a phrase" className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2" />
      <button type="submit" className="h-11 shrink-0 whitespace-nowrap rounded-md bg-primary px-4 text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2">Search</button>
    </form>
    <p aria-live="polite" className="text-sm text-muted-foreground">{status}</p>
    <ol className="space-y-3">{results.map((entry) => <li key={`${entry.version}-${entry.bookSlug}-${entry.chapter}-${entry.verse}`}><Link dir={entry.version === "avd" ? "rtl" : "ltr"} className="block rounded-md border border-border p-3 text-start text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2" href={`/${entry.version}/${entry.bookSlug}/${entry.chapter}#${entry.verse}`}><span className="font-semibold">{entry.book} {entry.chapter}:{entry.verse}</span><span className="block pt-1 text-muted-foreground">{entry.text}</span></Link></li>)}</ol>
  </section>;
}
