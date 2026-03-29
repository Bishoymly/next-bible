import { headers } from "next/headers";
import { HomePageComponent } from "@/components/home-page";

export default async function Home() {
  const acceptLanguage = (await headers()).get("accept-language")?.toLowerCase() ?? "";
  const language = acceptLanguage.includes("ar") ? "Arabic" : acceptLanguage.includes("es") ? "Spanish" : "English";

  return <HomePageComponent language={language} />;
}
