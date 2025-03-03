"use client";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvex } from "convex/react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useSidebar } from "../ui/sidebar";

function WorkspaceHistory() {
  const convex = useConvex();
  const userDetailContext = useContext(UserDetailContext);
  const { toggleSidebar } = useSidebar();
  const [workspaceList, setWorkspaceList] = useState<
    { _id: Id<"workspace">; messages: { content: string }[] }[]
  >([]);

  if (!userDetailContext) {
    throw new Error("2");
  }
  const { userDetail } = userDetailContext;

  useEffect(() => {
    if (userDetail?._id) GetAllWorkspace();
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetail?._id as Id<"users">,
    });
    setWorkspaceList(result);
  };

  return (
    <div>
      <h2>Lịch sử trò truyện</h2>
      <div>
        {workspaceList &&
          workspaceList?.slice().reverse().map((workspace, index) => (
            <Link key={index} href={"/chat/" + workspace?._id}>
              <div onClick={toggleSidebar} className="text-sm text-gray-400 font-light cursor-pointer hover:text-white hover:bg-slate-500 hover:bg-opacity-50 p-2 rounded-lg">
                {workspace?.messages[0]?.content}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default WorkspaceHistory;
