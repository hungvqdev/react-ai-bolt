import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import ToggleSidebar from "@/components/custom/ToggleSidebar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";
import { Metadata } from "next";
import React, { cache } from "react";

type Props = {
  params: Promise<{ id: string }>
}
 

const getWorkspace = cache(async (workspaceId: string) => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const result = await convex.query(api.workspace.GetWorkspace, {
    workspaceId: workspaceId as Id<"workspace">,
  });
  return result;
});

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params
  const res = await getWorkspace(id);
  return {
    title: res?.messages[0]?.content || "Chat",
  };
}

function Workspace() {
  return (
    <div className="px-6 pb-6">
      <ToggleSidebar />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ChatView />
        <div className="col-span-2">
          <CodeView />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
