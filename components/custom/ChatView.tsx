"use client";

import { MessagesContext } from "@/app/context/MessagesContext";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvex, useMutation } from "convex/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { CHAT_PROMPT } from "@/lib/prompt";
import { toast } from "sonner";

export const calculateWords = (inputText: string): number => {
  return inputText.trim().split(/\s+/).filter(word => word).length;
};


function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const workspaceId = (Array.isArray(id) ? id[0] : id) as Id<"workspace">;
  const router = useRouter()
  
  useEffect(() => {
    if (workspaceId) GetWorkspaceData();
  }, [workspaceId]);
  const messagesContext = useContext(MessagesContext);
  const userDetailContext = useContext(UserDetailContext);

  if (!messagesContext) {
    throw new Error("1");
  }
  if (!userDetailContext) {
    throw new Error("2");
  }

  const { messages, setMessages } = messagesContext;
  const { userDetail, setUserDetail } = userDetailContext;
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const UpdateTokens = useMutation(api.users.UpdateToken)
  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId,
    });
    setMessages(result?.messages);
  };
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == "user") {
        GetAiResponse();
      }
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + CHAT_PROMPT;
    const result = await axios.post("/api/ai-chat", {
      prompt: PROMPT,
    });
    const aiRes = {
      role: "ai",
      content: result?.data?.result,
    };
    setMessages((prev) => [...prev, aiRes]);

    await UpdateMessages({
      messages: [...messages, aiRes],
      workspaceId: id as Id<"workspace">,
    });

    const token = Number(userDetail?.token) - Number(calculateWords(JSON.stringify(aiRes)))
    setUserDetail(prev => ({
      ...prev!,
      token: token
    }))
    await UpdateTokens({
      userId: userDetail?._id as Id<'users'>,
      token: token
    })
    setLoading(false);
  };

  const onGenerate = (input: string) => {
    if(userDetail?.token as number < 100) {
      toast("Số lượng token của bạn không đủ để thực hiện yêu cầu.", {
        action: {
          label: "Mua ngay",
          onClick: () => router.push('/pricing'),
        },
        duration: Infinity,
        closeButton: true,
      });
      return
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);
  };
  return (
    <div className="relative h-[calc(100vh-128px)] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide">
        {messages?.map((msg, index) => 
        
        (
          <div
            key={index}
            className="p-3 rounded-lg text-white mb-2 bg-gray-600 flex items-start gap-2 leading-7"
          >
            {msg?.role === "user" && (
              <Image
                src={userDetail?.picture as string  || '/logo.png'}
                alt="Avatar"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <div className="flex flex-col">
               <ReactMarkdown>{msg.content}</ReactMarkdown> 
              
            </div>
          </div>
        )
        
        )}
        <div ref={messagesEndRef} />
        {loading && (
          <div className="p-3 rounded-lg text-white mb-2 bg-gray-600 flex items-start gap-2">
            <Loader2Icon className="animate-spin" />
            <div className="font-medium text-white text-sm">Chờ tý nhé...</div>
          </div>
        )}
      </div>
      <ChatInput onGenerate={onGenerate}/>
    </div>
  );
}

export default ChatView;
