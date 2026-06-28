import Link from "next/link";
import { uiText } from "@/lib/uiText";

export function SalvationGuideComponent({ language = "English" }) {
  const version = language === "Arabic" ? "avd" : "asv";
  const text = uiText[language];
  const verseText = text.salvationVerses ?? uiText.English.salvationVerses;
  const verseReferences = text.salvationReferences ?? uiText.English.salvationReferences;

  return (
    <div className="h-full px-1 py-1 sm:px-0 sm:py-0">
      <p className="editorial-eyebrow mb-3">{text.hope}</p>
      <h3 className="text-2xl font-semibold sm:text-3xl">{text.pathToSalvation}</h3>
      <p className="mt-3 text-muted-foreground">{text.salvationIntro}</p>

      <div className="mt-6 space-y-3">
        <div className="rounded-lg border border-border p-4">
          <h4 className="font-medium">{text.recognizeNeed}</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {verseText[0]} -
            <Link className="ml-1 underline-offset-4 hover:underline" href={`/${version}/romans/3#23`}>
              {verseReferences[0]}
            </Link>
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <h4 className="font-medium">{text.believeInJesus}</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {verseText[1]} -
            <Link className="ml-1 underline-offset-4 hover:underline" href={`/${version}/john/3#16`}>
              {verseReferences[1]}
            </Link>
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <h4 className="font-medium">{text.confessRepent}</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {verseText[2]} -
            <Link className="ml-1 underline-offset-4 hover:underline" href={`/${version}/1-john/1#9`}>
              {verseReferences[2]}
            </Link>
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <h4 className="font-medium">{text.acceptJesus}</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {verseText[3]} -
            <Link className="ml-1 underline-offset-4 hover:underline" href={`/${version}/romans/10#9`}>
              {verseReferences[3]}
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border p-4">
        <h4 className="mb-2 font-medium">{text.prayerForSalvation}</h4>
        <p className="text-sm text-muted-foreground">{text.prayerText}</p>
      </div>
    </div>
  );
}
