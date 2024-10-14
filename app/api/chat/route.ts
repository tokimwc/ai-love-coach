import { NextResponse } from "next/server"
import { DifyClient } from "@dify-ai/sdk"

const dify = new DifyClient(process.env.DIFY_API_KEY!)

export async function POST(req: Request) {
  const { message } = await req.json()

  try {
    const response = await dify.chat.createChatMessage({
      inputs: {},
      query: message,
      response_mode: "blocking",
      conversation_id: "love_coach_conversation",
    })

    return NextResponse.json({ response: response.answer })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}