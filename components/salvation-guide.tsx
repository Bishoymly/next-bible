import Link from "next/link";
import { uiText } from "@/lib/uiText";

export function SalvationGuideComponent({ language = "English" }) {
  const version = language === "Arabic" ? "avd" : "asv";
  const text = uiText[language];
  const verseText = text.salvationVerses ?? uiText.English.salvationVerses;
  const verseReferences = text.salvationReferences ?? uiText.English.salvationReferences;
  const teachings = [
    { title: text.recognizeNeed, verse: verseText[0], reference: verseReferences[0], href: `/${version}/romans/3#23` },
    { title: text.believeInJesus, verse: verseText[1], reference: verseReferences[1], href: `/${version}/john/3#16` },
    { title: text.confessRepent, verse: verseText[2], reference: verseReferences[2], href: `/${version}/1-john/1#9` },
    { title: text.acceptJesus, verse: verseText[3], reference: verseReferences[3], href: `/${version}/romans/10#9` },
  ];

  return (
    <div className="reader-salvation-guide">
      <p className="reader-salvation-intro">{text.salvationIntro}</p>
      <ol>
        {teachings.map((teaching) => (
          <li key={teaching.title}>
            <h2>{teaching.title}</h2>
            <blockquote>{teaching.verse}</blockquote>
            <Link href={teaching.href}>{teaching.reference}</Link>
          </li>
        ))}
      </ol>
      <section aria-labelledby="prayer-title">
        <h2 id="prayer-title">{text.prayerForSalvation}</h2>
        <p>{text.prayerText}</p>
      </section>
    </div>
  );
}
