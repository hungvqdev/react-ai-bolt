import { NextResponse } from "next/server";
import { GenAiCode } from "@/config/AiModel";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const result = await GenAiCode.sendMessage(prompt);
    const res = await result.response.text();
    return NextResponse.json(JSON.parse(res));
  } catch (error) {
    return NextResponse.json({ result: error });
  }
}
