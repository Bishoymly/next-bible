"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function SalvationGuideComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">How to Be Saved</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>The Path to Salvation</CardTitle>
          <CardDescription>God loves you and has a plan for your life. Follow these steps to begin your journey of faith.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="pr-4">
            <ol className="space-y-4">
              <li>
                <h3 className="font-semibold">Recognize your need for salvation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  &quot;For all have sinned and fall short of the glory of God.&quot; -{" "}
                  <Link className="text-blue-500 hover:text-blue-700 hover:underline" href="/asv/romans/3#23">
                    Romans 3:23
                  </Link>
                </p>
              </li>
              <li>
                <h3 className="font-semibold">Believe in Jesus Christ</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  &quot;For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.&quot; -
                  <Link className="text-blue-500 hover:text-blue-700 hover:underline" href="/asv/john/3#16">
                    John 3:16
                  </Link>
                </p>
              </li>
              <li>
                <h3 className="font-semibold">Confess and repent of your sins</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  &quot;If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.&quot; -
                  <Link className="text-blue-500 hover:text-blue-700 hover:underline" href="/asv/1-john/1#9">
                    1 John 1:9
                  </Link>
                </p>
              </li>
              <li>
                <h3 className="font-semibold">Accept Jesus as your Lord and Savior</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  &quot;If you declare with your mouth, &apos;Jesus is Lord,&apos; and believe in your heart that God raised him from the dead, you will be saved.&quot; -
                  <Link className="text-blue-500 hover:text-blue-700 hover:underline" href="/asv/romans/10#9">
                    Romans 10:9
                  </Link>
                </p>
              </li>
            </ol>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Prayer for Salvation</h3>
              <p className="text-sm text-muted-foreground">
                Dear God, I know that I am a sinner and need Your forgiveness. I believe that Jesus Christ died for my sins. I want to turn from my sins and follow You. I now invite Jesus to come into
                my heart and life as my personal Savior. I want to trust and follow You as my Lord. In Jesus&apos; name, Amen.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
