"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BookOpen, Search, Book, Users } from "lucide-react";
import { ChurchGuidanceComponent } from "./church-guidance";
import { SalvationGuideComponent } from "./salvation-guide";
import { GospelGuide } from "./gospel-guide";

export function HomePageComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <BookOpen className="mt-1 mr-3" />
              Bible Study
            </Link>
            {/*<div className="flex items-center space-x-4">
              <Link href="/about" className="hover:underline">
                About
              </Link>
              <Link href="/translations" className="hover:underline">
                Translations
              </Link>
              <Link href="/commentary" className="hover:underline">
                Commentary
              </Link>
              <Link href="/tools" className="hover:underline">
                Study Tools
              </Link>
            </div>*/}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Discover the Word of God</h1>
            <p className="text-xl mb-8">Explore the Bible with helpful insights and multiple translations.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href={`/asv/genesis`}>Start Reading</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={"/kjv"}>KJV</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={"/asv"}>ASV</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={"/avd"}>الكتاب المقدس</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Quick Access</h2>
            <div className="flex justify-center space-x-4 mb-8">
              <Select>
                <option>Select Translation</option>
                <option>KJV</option>
                <option>ESV</option>
                <option>NASB</option>
                <option>NIV</option>
              </Select>
              <Select>
                <option>Select Book</option>
                <option>Genesis</option>
                <option>Exodus</option>
                <option>Matthew</option>
                <option>Romans</option>
              </Select>
              <Input type="number" placeholder="Chapter" className="w-24" />
              <Button>
                <Search className="mr-2" /> Go
              </Button>
            </div>
            <div className="text-center">
              <Link href="/random" className="text-primary hover:underline">
                Open a Random Passage
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 hidden">
          <div className="container mx-auto px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Study Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-muted p-6 rounded-lg shadow-md">
                <Book className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Commentaries</h3>
                <p>Access in-depth commentaries from renowned Reformed Baptist scholars.</p>
              </div>
              <div className="bg-muted p-6 rounded-lg shadow-md">
                <Users className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Study Groups</h3>
                <p>Join virtual study groups to discuss and learn with fellow believers.</p>
              </div>
              <div className="bg-muted p-6 rounded-lg shadow-md">
                <BookOpen className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Reading Plans</h3>
                <p>Follow structured reading plans to guide your Bible study journey.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted py-8">
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 md:pr-8 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">New to the Bible?</h2>
                <div className="my-6 pb-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-700">Start from here</h2>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Start from the top and read through in order.</li>
                    <li>Take time to understand each passage.</li>
                    <li>Reflect on how each chapter contributes to the Gospel message.</li>
                    <li>Consider journaling your thoughts and questions.</li>
                    <li>Discuss what you&apos;re learning with others.</li>
                  </ol>
                </div>
              </div>
              <div className="md:w-2/3">
                <GospelGuide />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">For Advanced Students and Scholars</h2>
                <p className="mb-6">
                  Dive deeper into the Scriptures with our advanced study tools. Access original language resources, in-depth commentaries, and academic materials to enhance your understanding and
                  research.
                </p>
              </div>
              {/*<div className="md:w-1/2 bg-muted rounded-lg shadow-lg h-64 flex items-center justify-center"></div>*/}
            </div>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch md:space-x-6 space-y-6 md:space-y-0">
              <SalvationGuideComponent />
              <ChurchGuidanceComponent />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-8">
          {/*<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/mission" className="hover:underline">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link href="/beliefs" className="hover:underline">
                    Statement of Faith
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="hover:underline">
                    Our Team
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/podcasts" className="hover:underline">
                    Podcasts
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="hover:underline">
                    Video Teachings
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/groups" className="hover:underline">
                    Study Groups
                  </Link>
                </li>
                <li>
                  <Link href="/forums" className="hover:underline">
                    Discussion Forums
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:underline">
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/newsletter" className="hover:underline">
                    Newsletter
                  </Link>
                </li>
                <li>
                  <Link href="/donate" className="hover:underline">
                    Support Our Ministry
                  </Link>
                </li>
              </ul>
            </div>
          </div>*/}
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Bible Study. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
