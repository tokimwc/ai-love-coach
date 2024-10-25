import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, User, MessageCircle, Settings } from "lucide-react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <nav className="w-64 bg-card p-4 flex flex-col">
        <div className="flex items-center mb-8">
          <Heart className="text-primary mr-2" />
          <h1 className="text-2xl font-bold">AI Love Coach</h1>
        </div>
        <Link href="/" className="mb-2">
          <Button variant="ghost" className="w-full justify-start">
            <Heart className="mr-2 h-4 w-4" /> ホーム
          </Button>
        </Link>
        <Link href="/chat" className="mb-2">
          <Button variant="ghost" className="w-full justify-start">
            <MessageCircle className="mr-2 h-4 w-4" /> チャット
          </Button>
        </Link>
        <Link href="/profile" className="mb-2">
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" /> プロフィール
          </Button>
        </Link>
        <Link href="/settings" className="mb-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" /> 設定
          </Button>
        </Link>
      </nav>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
