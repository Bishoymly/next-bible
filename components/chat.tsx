"use client";

import { CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { ScrollArea } from "./ui/scroll-area";
import React, { useEffect, useState, useMemo } from "react";
import { BotMessageSquare, UserRound } from "lucide-react";

function formatChatResponseToHTML(version: string, response: string) {
  // Escape any HTML special characters to avoid XSS attacks
  const escapeHtml = (text: string) => {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  };

  // Convert markdown-like formatting to HTML
  const formatText = (text: string) => {
    // Bold: **text** -> <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic: _text_ -> <em>text</em>
    text = text.replace(/_(.*?)_/g, "<em>$1</em>");

    // Optionally add more patterns here, like links, etc.
    return text;
  };

  // Function to format a detected verse to a Next.js Link component
  const formatVerse = (match: string, book: string, chapter: string, verse: string) => {
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

function getMessageContent(message: any): string {
  // Handle new UIMessage format with parts
  if (message.parts && Array.isArray(message.parts)) {
    return message.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('');
  }
  // Fallback to content if available
  if (message.content) {
    return message.content;
  }
  return '';
}

export function Chats({ version, book, chapter, question }: { version: string; book: string; chapter: string; question?: string }) {
  const [input, setInput] = useState("");
  
  const transport = useMemo(() => new TextStreamChatTransport({
    api: "/api/chat?version=" + version + "&book=" + book + "&chapter=" + chapter,
  }), [version, book, chapter]);

  const { messages, sendMessage, status } = useChat({
    transport,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === 'streaming') return;
    
    const messageToSend = input;
    setInput("");
    await sendMessage({ text: messageToSend });
  };

  useEffect(() => {
    if (question) {
      setInput(question);
    }
  }, [question]);

  return (
    <div className="flex flex-col h-full w-full border-0 shadow-none space-y-4 p-4">
      <div>
        <CardDescription className="mr-3">This AI provides general Bible information and is not a substitute for personal study or guidance from religious leaders.</CardDescription>
      </div>
      <ScrollArea className="flex-1 w-full pr-4">
        {messages.map((message) => {
          const content = getMessageContent(message);
          return (
            <div key={message.id} className="flex gap-3 text-slate-600 mb-4">
              {message.role === "user" && <UserRound className="w-8 h-8" />}
              {message.role === "assistant" && <BotMessageSquare className="w-16 h-16" />}

              <p className="leading-relaxed">
                <span className="block font-bold text-slate-700">{message.role === "user" ? "User" : "AI"}</span>
                <span dangerouslySetInnerHTML={{ __html: formatChatResponseToHTML(version, content) }}></span>
              </p>
            </div>
          );
        })}
      </ScrollArea>

      <div>
        <form className="w-full flex gap-2" onSubmit={handleSubmit}>
          <Input placeholder="How can I help you?" value={input} onChange={handleInputChange} disabled={status === 'streaming'} />
          <Button type="submit" disabled={status === 'streaming' || !input.trim()}>Send</Button>
        </form>
      </div>
    </div>
  );
}
