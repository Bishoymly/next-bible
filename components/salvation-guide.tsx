import Image from "next/image";
import Link from "next/link";
import { uiText } from "@/lib/uiText";

export function SalvationGuideComponent({ language = "English" }) {
  const version = language === "Arabic" ? "avd" : "asv";
  const text = uiText[language];
  const verseText = text.salvationVerses ?? uiText.English.salvationVerses;
  const verseReferences = text.salvationReferences ?? uiText.English.salvationReferences;
  const teachingHrefs = language === "English"
    ? [
        "/bsb/romans/3#23",
        "/bsb/1-corinthians/15#3",
        "/bsb/ephesians/2#8",
        "/bsb/mark/1#15",
      ]
    : [
        `/${version}/romans/3#23`,
        `/${version}/john/3#16`,
        `/${version}/1-john/1#9`,
        `/${version}/romans/10#9`,
      ];
  const teachings = [
    { title: text.recognizeNeed, verse: verseText[0], reference: verseReferences[0], href: teachingHrefs[0] },
    { title: text.believeInJesus, verse: verseText[1], reference: verseReferences[1], href: teachingHrefs[1] },
    { title: text.confessRepent, verse: verseText[2], reference: verseReferences[2], href: teachingHrefs[2] },
    { title: text.acceptJesus, verse: verseText[3], reference: verseReferences[3], href: teachingHrefs[3] },
  ];

  return (
    <div className="reader-salvation-guide">
      <div className="reader-gospel-opening">
        <p className="reader-salvation-intro">{text.salvationIntro}</p>
        <figure className="reader-gospel-image">
          <Image
            src="/img/gospel-scripture.png"
            alt=""
            width={1448}
            height={1086}
            priority
            sizes="(max-width: 760px) calc(100vw - 40px), 44vw"
          />
        </figure>
      </div>
      <ul aria-label="The gospel in Scripture">
        {teachings.map((teaching) => (
          <li key={teaching.title}>
            <h2>{teaching.title}</h2>
            <blockquote>{teaching.verse}</blockquote>
            <Link href={teaching.href}>{teaching.reference}</Link>
          </li>
        ))}
      </ul>
      <section aria-labelledby="prayer-title">
        <h2 id="prayer-title">{text.prayerForSalvation}</h2>
        <div className="reader-salvation-prayer-copy">
          <p>{text.prayerText}</p>
          <p>{text.prayerNote}</p>
        </div>
      </section>
    </div>
  );
}
