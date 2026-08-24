import Link from "next/link";
import { ArrowRight } from "lucide-react";
import legacy from "@/public/generated/legacy/manifest.json";
import { ReaderPage } from "@/components/reader-page";

const topicCounts = (legacy.studies as { topicSlug: string }[]).reduce<Record<string, number>>((counts, study) => {
  counts[study.topicSlug] = (counts[study.topicSlug] ?? 0) + 1;
  return counts;
}, {});
const topics = (legacy.records as { kind?: string; slug?: string }[])
  .filter((record) => record.kind === "topics" && record.slug && !["unknown", "misc"].includes(record.slug))
  .map((record) => record.slug!);
export const metadata = { title: "Study topics", alternates: { canonical: "/topics" } };
export default function TopicsPage() {
  return (
    <ReaderPage
      title="Study topics"
      description="Explore published studies by subject, then return to the passage to read each claim in context."
      wide
    >
      <ul className="reader-topic-grid">
        {topics.map((topic) => (
          <li key={topic}>
            <Link href={`/topics/${topic}`}>
              <span>
                <strong>{topic.replaceAll("-", " ")}</strong>
                <small>{topicCounts[topic] ?? 0} published studies</small>
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </ReaderPage>
  );
}
