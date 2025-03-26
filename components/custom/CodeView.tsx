"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import axios from "axios";
import { MessagesContext } from "@/app/context/MessagesContext";
import { CODE_GEN_PROMPT, DEFAULT_FILE, DEPENDANCY } from "@/constants/prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2Icon, LucideDownload, Rocket } from "lucide-react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import SandpackPreviewClient from "./SandpackPreviewClient";
import { Button } from "../ui/button";
import { ActionType } from "@/app/types";
import { calculateWords } from "@/utils/calculateWords";

function CodeView() {
  const { id } = useParams();
  const [active, setActive] = useState("code");
  const [files, setFiles] = useState(DEFAULT_FILE);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const [loading, setLoading] = useState(true);
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const messagesContext = useContext(MessagesContext);
  const userDetailContext = useContext(UserDetailContext);
  const [action, setAction] = useState<ActionType | null>();

  if (!messagesContext) {
    throw new Error("1");
  }
  if (!userDetailContext) {
    throw new Error("2");
  }

  const { messages } = messagesContext;
  const { userDetail, setUserDetail } = userDetailContext;

  useEffect(() => {
    if (id) GetFiles();
  }, [id]);

  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id as Id<"workspace">,
    });
    const mergedFiles = { ...DEFAULT_FILE, ...result?.fileData };
    setFiles(mergedFiles);
    setLoading(false);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == "user") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + " " + CODE_GEN_PROMPT;
    const result = await axios.post("/api/gen-ai-code", {
      prompt: PROMPT,
    });
    const aiRes = result?.data;
    const mergedFiles = { ...DEFAULT_FILE, ...aiRes?.files };
    setFiles(mergedFiles);
    await UpdateFiles({
      workspaceId: id as Id<"workspace">,
      files: aiRes?.files,
    });

    const token =
      Number(userDetail?.token || 0) -
      Number(calculateWords(JSON.stringify(aiRes)));
    await UpdateTokens({
      userId: userDetail?._id as Id<"users">,
      token: token,
    });
    setUserDetail((prev) => ({
      ...prev!,
      token: token,
    }));
    setLoading(false);
  };

  const onActionBtn = (action: string) => {
    setAction({
      actionType: action,
      timestamp: Date.now(),
    });
  };
  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border flex justify-between items-center">
        <div className="flex items-center flex-wrap shrink-0 rounded-s-full bg-black p-1 justify-center w-[140px] gap-1">
          <h2
            className={`text-sm cursor-pointer py-1 px-2 ${active === "code" && "text-blue-500 bg-blue-500 bg-opacity-20 rounded-full font-medium"}`}
            onClick={() => setActive("code")}
          >
            Code
          </h2>
          <h2
            className={`text-sm cursor-pointer py-1 px-2 ${active === "preview" && "text-blue-500 bg-blue-500 bg-opacity-20 rounded-full font-medium"}`}
            onClick={() => setActive("preview")}
          >
            Preview
          </h2>
        </div>
        {active === "preview" && (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onActionBtn("export")}>
              <LucideDownload />
              Export
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => onActionBtn("deploy")}
            >
              <Rocket /> Deploy
            </Button>
          </div>
        )}
      </div>
      <SandpackProvider
        template="react"
        theme={"dark"}
        files={files}
        customSetup={{ dependencies: { ...DEPENDANCY } }}
        options={{ externalResources: ["https://cdn.tailwindcss.com"] }}
      >
        <SandpackLayout>
          {active === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "calc(100vh - 185px)" }} />
              <SandpackCodeEditor style={{ height: "calc(100vh - 185px)" }} />
            </>
          ) : (
            <>
              <SandpackPreviewClient action={action as ActionType} />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
      {loading && (
        <div className="p-3 rounded-lg text-white mb-2 bg-gray-900 flex items-center justify-center gap-2 opacity-80 absolute top-0 w-full h-full">
          <Loader2Icon className="animate-spin" />
          <div className="font-medium text-white text-sm">Chờ tý nhé...</div>
        </div>
      )}
    </div>
  );
}

export default CodeView;
