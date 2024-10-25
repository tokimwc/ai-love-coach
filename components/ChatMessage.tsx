import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Message } from "@/types"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-end mb-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="mr-2">
          <AvatarImage src="/ai-avatar.png" alt="AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-md p-4 rounded-lg prose prose-sm dark:prose-invert",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
      </div>
      {isUser && (
        <Avatar className="ml-2">
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
