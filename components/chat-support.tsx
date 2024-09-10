import { ExpandableChat } from "@/components/ui/chat/expandable-chat";
import { Chats } from "./chat";

export default function ChatSupport() {
  return (
    <ExpandableChat size="lg" position="bottom-right">
      <Chats />
    </ExpandableChat>
  );
}
