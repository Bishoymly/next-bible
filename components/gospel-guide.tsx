"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

const essentialChapters = [
  {
    book: "Luke",
    chapter: 1,
    description: "The birth of Jesus foretold and the purpose of his coming.",
  },
  {
    book: "Luke",
    chapter: 2,
    description: "The birth of Jesus and his early years.",
  },
  {
    book: "Matthew",
    chapter: 5,
    description: "The Sermon on the Mount: Jesus' teachings on Kingdom living.",
  },
  {
    book: "John",
    chapter: 3,
    description: "Jesus explains the concept of being 'born again' and God's love for the world.",
  },
  {
    book: "Mark",
    chapter: 8,
    description: "Peter's confession of Christ and Jesus predicts his death and resurrection.",
  },
  {
    book: "Luke",
    chapter: 15,
    description: "Parables of the Lost Sheep, Lost Coin, and Prodigal Son, illustrating God's love for the lost.",
  },
  {
    book: "John",
    chapter: 14,
    description: "Jesus comforts his disciples and promises the Holy Spirit.",
  },
  {
    book: "Luke",
    chapter: 23,
    description: "The crucifixion of Jesus.",
  },
  {
    book: "Luke",
    chapter: 24,
    description: "The resurrection of Jesus and his appearances to disciples.",
  },
  {
    book: "Acts",
    chapter: 2,
    description: "The coming of the Holy Spirit and the birth of the Church.",
  },
  {
    book: "Romans",
    chapter: 3,
    description: "The problem of sin and the solution through faith in Christ.",
  },
  {
    book: "Romans",
    chapter: 8,
    description: "Life in the Spirit and God's love for believers.",
  },
];

export function GospelGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Essential Gospel Chapters</h1>
          <p className="text-gray-600 mb-6">A compact guide to understanding the core message of the Gospel</p>
          <div className="my-6 border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">How to Use This Guide</h2>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Start from the top and read through in order.</li>
              <li>Take time to understand each passage.</li>
              <li>Reflect on how each chapter contributes to the Gospel message.</li>
              <li>Use the "Read Now" links to access the full text.</li>
              <li>Consider journaling your thoughts and questions.</li>
              <li>Discuss what you're learning with others.</li>
            </ol>
          </div>

          <ul className="space-y-4">
            {essentialChapters.map((chapter, index) => (
              <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href={`/asv/${chapter.book.toLowerCase()}/${chapter.chapter}`} className="flex items-center text-blue-500 hover:text-blue-700">
                    <div className="flex items-center mb-2">
                      <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
                      <h2 className="text-lg font-semibold text-gray-800">
                        {chapter.book} {chapter.chapter}
                      </h2>
                    </div>
                  </Link>
                </Button>
                <p className="text-sm text-gray-600 mb-2">{chapter.description}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
