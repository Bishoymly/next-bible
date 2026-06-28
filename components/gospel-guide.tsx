import Link from "next/link";
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
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.href} className="rounded-lg border border-border px-4 py-3 text-sm leading-6">
          <Link href={item.href} prefetch={false} className="font-medium underline-offset-4 hover:underline">
            {item.label}
          </Link>
          <span className="ml-2 text-muted-foreground">{item.description}</span>
        </li>
      ))}
    </ul>
  );
}
