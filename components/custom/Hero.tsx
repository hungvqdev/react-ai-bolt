"use client";
import { MessagesContext } from "@/app/context/MessagesContext";
import React, { useContext, useState } from "react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import SignInDialog from "./SignInDialog";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import ChatInput from "./ChatInput";
import { toast } from "sonner";
import ToggleSidebar from "./ToggleSidebar";

const LOOKUP_SUGGESTIONS: string[] = [
  "Tạo màn hình đăng nhập",
  "Tạo dashboard trang bán hàng",
  "Tạo ứng dụng đặt đồ ăn",
  "clone todo app",
];

function Hero() {
  const messagesContext = useContext(MessagesContext);
  const userDetailContext = useContext(UserDetailContext);

  if (!messagesContext) {
    throw new Error("1");
  }
  if (!userDetailContext) {
    throw new Error("2");
  }

  const { setMessages } = messagesContext;
  const { userDetail } = userDetailContext;
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();
  const onGenerate = async (input: string) => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
    if ((userDetail?.token as number) < 100) {
      toast("Số lượng token của bạn không đủ để thực hiện yêu cầu.", {
        action: {
          label: "Mua ngay",
          onClick: () => router.push("/pricing"),
        },
        duration: Infinity,
        closeButton: true,
      });
      return;
    }

    const msg = { role: "user", content: input };
    setMessages([msg]);
    const workspaceId = await CreateWorkspace({
      user: userDetail._id as Id<"users">,
      messages: [msg],
    });
    router.push("/chat/" + workspaceId);
  };

  return (
    <div>
      {userDetail && (
        <div className="px-3 absolute top-[7px]">
          <ToggleSidebar />
        </div>
      )}
      <div className="flex flex-col items-center mt-24 xl:mt-32 gap-2">
        <div className="font-bold text-3xl">Tôi có thể giúp gì cho bạn? </div>
        <div className="text-gray-400 font-medium">
          Chúng ta cùng nhau xây dừng 1 ứng dụng bằng ReactJs nào.
        </div>

        <ChatInput onGenerate={onGenerate} />

        <div className="font-medium mt-5">Gợi ý từ khóa cho bạn</div>
        <div className="flex flex-wrap max-w-2xl items-center justify-center gap-3">
          {LOOKUP_SUGGESTIONS.map((suggestion, index) => (
            <div
              key={index}
              className="border rounded-full p-1 px-2 cursor-pointer"
              onClick={() => onGenerate(suggestion)}
            >
              <h2 className="text-sm text-gray-500 hover:text-white ">
                {suggestion}
              </h2>
            </div>
          ))}
        </div>
        <SignInDialog open={openDialog} close={(e) => setOpenDialog(e)} />
      </div>
    </div>
  );
}

export default Hero;
