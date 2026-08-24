import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { uiText } from "@/lib/uiText";

type GospelGuideProps = {
  language?: keyof typeof uiText;
};

export function GospelGuide({ language = "English" }: GospelGuideProps) {
  const locale = uiText[language] ?? uiText.English;
  const items = locale.gospelEntries.map((entry, index) => ({
    href: entry.href,
    label: entry.label,
    description: locale.gospelDescriptions[index] ?? "",
  }));

  return (
    <ol className="reader-start-path">
      {items.map((item) => (
        <li key={item.href}>
          <div>
            <h2>{item.label}</h2>
            <p>{item.description}</p>
          </div>
          <Link href={item.href} prefetch={false} aria-label={`Read ${item.label}`}>
            <ArrowRight aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ol>
  );
}
