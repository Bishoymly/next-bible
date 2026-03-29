"use client";

import { AlertTriangle, Church } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { uiText } from "@/lib/uiText";

export function ChurchGuidanceComponent({ language = "English" }) {
  const text = uiText[language];
  return (
    <div className="h-full px-1 py-1 text-foreground sm:px-0 sm:py-0">
      <p className="editorial-eyebrow mb-3">{text.community}</p>
      <h3 className="text-4xl text-foreground">{text.churchGuidanceTitle}</h3>
      <p className="mt-3 text-base text-muted-foreground">{text.churchGuidanceIntro}</p>

      <div className="mt-6 rounded-[1.2rem] bg-background/35 p-4 ring-1 ring-border/35">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-4 w-4 text-accent" />
          <div>
            <h4 className="font-semibold text-foreground">{text.importantReminder}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{text.churchReminderText}</p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-muted-foreground">{text.churchCommunityText}</p>
      <ul className="mt-4 space-y-3 text-muted-foreground">
        <li className="rounded-[1.05rem] bg-background/28 px-4 py-3 ring-1 ring-border/30">{text.attendChurch}</li>
        <li className="rounded-[1.05rem] bg-background/28 px-4 py-3 ring-1 ring-border/30">{text.seekMentorship}</li>
        <li className="rounded-[1.05rem] bg-background/28 px-4 py-3 ring-1 ring-border/30">{text.participateGroups}</li>
        <li className="rounded-[1.05rem] bg-background/28 px-4 py-3 ring-1 ring-border/30">{text.worshipPrayer}</li>
      </ul>

      <div className="mt-6">
        <Button className="w-full" asChild>
          <Link href="https://www.google.com/maps/search/Reformed+Church+near+me" target="_blank">
            <Church className="mr-2 h-4 w-4" /> {text.findChurchNearYou}
          </Link>
        </Button>
      </div>
    </div>
  );
}
