"use client";

import { CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { ScrollArea } from "./ui/scroll-area";
import React, { useEffect } from "react";
import { BotMessageSquare, UserRound } from "lucide-react";

function formatChatResponseToHTML(version, response) {
  // Escape any HTML special characters to avoid XSS attacks
  const escapeHtml = (text) => {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  };

  // Convert markdown-like formatting to HTML
  const formatText = (text) => {
    // Bold: **text** -> <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic: _text_ -> <em>text</em>
    text = text.replace(/_(.*?)_/g, "<em>$1</em>");

    // Optionally add more patterns here, like links, etc.
    return text;
  };

  // Function to format a detected verse to a Next.js Link component
  const formatVerse = (match, book, chapter, verse) => {
    // Construct the path for the verse link with an anchor to the verse
    const path = `/${version}/${book.toLowerCase().trim().replace(/ /g, "-")}/${chapter}#${verse}`;

    // Return an anchor link component as a string for use in dangerouslySetInnerHTML
    return `<a class="underline" href="${path}">${escapeHtml(match)}</a>`;
  };

  // Regex to match Bible verses like "John 3:16"
  const verseRegex = /\b([1-3]?\s?[A-Za-z]+)\s(\d+):(\d+)(?:-(\d+))?\b/g;

  // Split the response into paragraphs by double new lines
  const paragraphs = response.split(/\n/);

  // Wrap each paragraph with <p> tags and format text
  const formattedHtml = paragraphs.map((paragraph) => `${formatText(escapeHtml(paragraph)).replace(verseRegex, formatVerse)}<br />`).join("");

  return formattedHtml;
}

export function Chats({ version, book, chapter, question }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat?version=" + version + "book=" + book + "&chapter=" + chapter,
  });

  useEffect(() => {
    if (question) {
      handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [question]); // Only run this effect when the question prop changes

  return (
    <div className="flex flex-col h-full w-full border-0 shadow-none space-y-4 p-4">
      <div>
        {/*<CardTitle> Bible AI </CardTitle>*/}
        <CardDescription className="mr-3">This AI provides general Bible information and is not a substitute for personal study or guidance from religious leaders.</CardDescription>
      </div>
      <ScrollArea className="flex-1 w-full pr-4">
        {messages.map((message) => {
          return (
            <div key={message.id} className="flex gap-3 text-slate-600 mb-4">
              {message.role === "user" && <UserRound className="w-8 h-8" />}
              {message.role === "assistant" && <BotMessageSquare className="w-16 h-16" />}

              <p className="leading-relaxed">
                <span className="block font-bold text-slate-700">{message.role === "user" ? "User" : "AI"}</span>
                <span dangerouslySetInnerHTML={{ __html: formatChatResponseToHTML(version, message.content) }}></span>
              </p>
            </div>
          );
        })}
      </ScrollArea>

      <div>
        <form className="w-full flex gap-2" onSubmit={handleSubmit}>
          <Input placeholder="How can I help you?" value={input} onChange={handleInputChange} />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
