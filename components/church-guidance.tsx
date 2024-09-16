"use client";

import { AlertTriangle, Church, Users } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ChurchGuidanceComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Find Guidance in a Faithful Church</CardTitle>
          <CardDescription className="text-center">This app is a tool, not a substitute for church community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Reminder</AlertTitle>
            <AlertDescription>This Bible study app is not a replacement for the growth and guidance you need in a discipling relationship within a healthy church context.</AlertDescription>
          </Alert>
          <p className="text-muted-foreground">While this app can aid your personal study, true spiritual growth happens in community. We strongly encourage you to:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Regularly attend a Bible-believing church</li>
            <li>Seek mentorship from mature believers</li>
            <li>Participate in small groups or Bible studies</li>
            <li>Engage in corporate worship and prayer</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" asChild>
            <Link href="https://churches.sbc.net/" target="_blank">
              <Church className="mr-2 h-4 w-4" /> Find a Church Near You
            </Link>
          </Button>
          {/*<Button variant="outline" className="w-full" asChild>
            <Link href="/community">
              <Users className="mr-2 h-4 w-4" /> Connect with Other Believers
            </Link>
          </Button>*/}
        </CardFooter>
      </Card>
    </div>
  );
}
