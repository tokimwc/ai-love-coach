import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-white">AI Love Coach</h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl mb-8 text-white"
      >
        Your personal AI-powered dating advisor
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Link href="/chat">
          <Button size="lg" className="bg-white text-pink-500 hover:bg-pink-100">
            <Heart className="mr-2 h-4 w-4" /> Start Chatting
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}