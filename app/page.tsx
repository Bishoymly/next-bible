import { headers } from "next/headers";
import { HomePageComponent } from "@/components/home-page";
import { uiText } from "@/lib/uiText";

type HomeLanguage = keyof typeof uiText;

function resolveLanguage(acceptLanguage: string): HomeLanguage {
  if (acceptLanguage.includes("ar")) return "Arabic";
  if (acceptLanguage.includes("es")) return "Spanish";
  return "English";
}

export default async function Home() {
  const acceptLanguage = (await headers()).get("accept-language")?.toLowerCase() ?? "";
  const language = resolveLanguage(acceptLanguage);

  return <HomePageComponent language={language} />;
}
