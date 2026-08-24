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
  return <section className="reader-search">
    <form onSubmit={(event) => { event.preventDefault(); void search(); }}>
      <label className="sr-only" htmlFor="translation">Translation</label>
      <select id="translation" value={version} onChange={(event) => { setVersion(event.target.value); setResults([]); setStatus("Ready to search this translation."); }}>
        <option value="bsb">Berean Standard Bible</option><option value="asv">American Standard Version</option><option value="kjv">King James Version</option><option value="avd">Arabic Van Dyck</option>
      </select>
      <label className="sr-only" htmlFor="scripture-search">Search Scripture</label>
      <input id="scripture-search" dir="auto" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search exact words or a phrase" />
      <button type="submit">Search</button>
    </form>
    <p aria-live="polite" className="reader-search-status">{status}</p>
    <ol className="reader-search-results">{results.map((entry) => <li key={`${entry.version}-${entry.bookSlug}-${entry.chapter}-${entry.verse}`}><Link dir={entry.version === "avd" ? "rtl" : "ltr"} href={`/${entry.version}/${entry.bookSlug}/${entry.chapter}#${entry.verse}`}><strong>{entry.book} {entry.chapter}:{entry.verse}</strong><span>{entry.text}</span></Link></li>)}</ol>
  </section>;
}
