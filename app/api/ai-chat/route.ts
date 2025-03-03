import { NextResponse } from "next/server";
import { chatSession } from "@/config/AiModel";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const result = await chatSession.sendMessage(prompt);
    const res =  await result.response.text();
    return NextResponse.json({ result: res });
  } catch (error) {
    return NextResponse.json({ result: error });
  }
}
