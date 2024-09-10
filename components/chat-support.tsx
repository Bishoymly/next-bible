import { ExpandableChat } from "@/components/ui/chat/expandable-chat";
import { Chats } from "./chat";

export default function ChatSupport({ book, chapter, question }) {
  return (
    <ExpandableChat size="lg" position="bottom-right" question={question}>
      <Chats book={book} chapter={chapter} question={question} />
    </ExpandableChat>
  );
}
