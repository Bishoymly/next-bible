"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { ScrollArea } from "./ui/scroll-area";

function formatChatResponseToHTML(response) {
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
    const path = `/asv/${book.toLowerCase().trim().replace(/ /g, "-")}/${chapter}#${verse}`;

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

export function Chats() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div className="flex flex-col h-full w-full border-0 shadow-none space-y-4 p-4">
      <div>
        {/*<CardTitle> Bible AI </CardTitle>*/}
        <CardDescription>
          This AI provides general Bible information and is not a substitute for personal study or guidance from religious leaders. Interpretations may vary. Consult the Bible and trusted faith
          advisors for spiritual guidance.
        </CardDescription>
      </div>
      <ScrollArea className="flex-1 w-full pr-4">
        {messages.map((message) => {
          return (
            <div key={message.id} className="flex gap-3 text-slate-600 text-sm mb-4">
              {message.role === "user" && (
                <Avatar>
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
              )}
              {message.role === "assistant" && (
                <Avatar>
                  <AvatarFallback>AI</AvatarFallback>
                  {/*<AvatarImage src="https://github.com/shadcn.png" />*/}
                </Avatar>
              )}

              <p className="leading-relaxed">
                <span className="block font-bold text-slate-700">{message.role === "user" ? "User" : "AI"}</span>
                <span dangerouslySetInnerHTML={{ __html: formatChatResponseToHTML(message.content) }}></span>
              </p>
            </div>
          );
        })}
      </ScrollArea>

      <div>
        <form className="w-full flex gap-2" onSubmit={handleSubmit}>
          <Input placeholder="How Can I help you?" value={input} onChange={handleInputChange} />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}