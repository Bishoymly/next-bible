import fs from "node:fs";
import path from "node:path";

const sitemapUrl = "https://ask.holybiblereader.com/sitemap.xml";
const response = await fetch(sitemapUrl);
if (!response.ok) throw new Error(`Could not download legacy sitemap: ${response.status}`);
const xml = await response.text();
const records = [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)].map((match) => new URL(match[1].trim()).pathname.replace(/\/$/, "") || "/").map((pathname) => {
  const match = pathname.match(/^\/(study|topics)\/([a-z0-9-]+)$/);
  return match ? { pathname, kind: match[1], slug: match[2] } : { pathname, kind: pathname.slice(1) || "root" };
});
const studySlugs = records.filter((record) => record.kind === "study" && record.slug).map((record) => record.slug);
const topics = records.filter((record) => record.kind === "topics" && record.slug).map((record) => record.slug);
if (studySlugs.length !== 999 || topics.length !== 10) throw new Error(`Unexpected legacy sitemap shape: ${studySlugs.length} study slugs, ${topics.length} topics`);
const bySlug = new Map();
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Supabase migration environment is required.");
let scanned = 0; let expected = null;
try {
  let lastId = null;
  for (;;) {
    const url = new URL("/rest/v1/bible_studies", process.env.NEXT_PUBLIC_SUPABASE_URL);
    url.searchParams.set("select", "id,query,content,topic,updated_at,image_url"); url.searchParams.set("order", "id.asc"); url.searchParams.set("limit", "50"); if (lastId !== null) url.searchParams.set("id", `gt.${lastId}`);
    let result; for (let attempt = 0; attempt < 3; attempt += 1) { result = await fetch(url, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, ...(lastId === null ? { Prefer: "count=exact" } : {}) } }); if (result.ok || result.status < 500) break; await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt)); }
    if (!result?.ok) throw new Error(`Supabase study export failed: ${result?.status} ${await result?.text()}`);
    if (expected === null) expected = Number((result.headers.get("content-range") || "").split("/")[1]) || null;
    const rows = await result.json(); for (const row of rows) if (typeof row.query === "string") bySlug.set(row.query.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"), row); scanned += rows.length; if (rows.length < 50) break;
    const nextId = rows.at(-1)?.id; if (nextId === undefined || nextId === lastId) throw new Error("Supabase keyset export made no progress."); lastId = nextId;
  }
  if (expected !== null) console.log(`Scanned ${scanned || expected}/${expected} Supabase study rows.`);
} catch (error) { throw new Error(`Supabase study export stopped: ${error instanceof Error ? error.message : "unknown error"}`); }
function plain(value) { return String(value ?? "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<\/(p|h[1-6]|li|div|br)[^>]*>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").split(/\n+/).map((item) => item.replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, 200); }
const uniqueSlugs = [...new Set(studySlugs)]; const unmatched = uniqueSlugs.filter((slug) => !bySlug.has(slug));
const auditedMinimumRows = 3219;
if (expected === null || expected < auditedMinimumRows || scanned !== expected || unmatched.length) throw new Error(`Incomplete migration: expected ${expected}, scanned ${scanned}, unmatched ${unmatched.length}`);
const target = path.join(process.cwd(), "public", "generated", "legacy"); fs.rmSync(target, { recursive: true, force: true }); fs.mkdirSync(path.join(target, "studies"), { recursive: true });
const studies = studySlugs.map((slug) => { const row = bySlug.get(slug); const topic = typeof row?.topic === "string" ? row.topic : "unknown"; const study = { slug, title: String(row?.query || slug.replaceAll("-", " ")), paragraphs: plain(row?.content), topic, topicSlug: topic.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-"), updatedAt: typeof row?.updated_at === "string" ? row.updated_at : null, imageUrl: typeof row?.image_url === "string" && /^https:\/\//.test(row.image_url) ? row.image_url : null }; fs.writeFileSync(path.join(target, "studies", `${slug}.json`), `${JSON.stringify(study)}\n`); return { slug, title: study.title, topic: study.topic, topicSlug: study.topicSlug, updatedAt: study.updatedAt, imageUrl: study.imageUrl, hasContent: study.paragraphs.length > 0 }; });
fs.writeFileSync(path.join(target, "manifest.json"), `${JSON.stringify({ schemaVersion: 2, source: sitemapUrl, importStats: { expectedRows: expected, scannedRows: scanned, uniqueStudySlugs: uniqueSlugs.length, matchedStudySlugs: uniqueSlugs.length - unmatched.length }, records, studies })}\n`);
console.log(`Imported ${studySlugs.length} study snapshots and ${topics.length} topic slugs. ${bySlug.size ? "Supabase content included." : "Sitemap fallback content used."} Matched ${uniqueSlugs.length - unmatched.length}/${uniqueSlugs.length} unique slugs; unmatched: ${unmatched.length}${unmatched.length ? ` (${unmatched.join(", ")})` : ""}.`);
