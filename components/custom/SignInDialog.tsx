import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { setUserCookie } from "@/app/actions";

function SignInDialog({
  open,
  close,
}: {
  open: boolean;
  close: (e: boolean) => void;
}) {
  const convex = useConvex();
  const userDetailContext = useContext(UserDetailContext);

  if (!userDetailContext) {
    throw new Error("2");
  }

  const { setUserDetail } = userDetailContext;
  const CreateUser = useMutation(api.users.CreateUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse?.access_token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user info");

        const data = await response.json();

        await CreateUser({
          name: data?.name,
          email: data?.email,
          picture: data?.picture,
          uid: uuidv4(),
        });

        const storedUser = await convex.query(api.users.GetUser, {
          email: data?.email,
        });
        if (typeof window !== undefined) {
          setUserCookie(storedUser); 
        }
        setUserDetail(storedUser);

        close(false);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div>
      <Dialog open={open} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription
              className="flex flex-col items-center justify-center"
              asChild
            >
              <div>
                <div className="font-bold text-2xl text-white">
                  Chào mừng trở lại
                </div>
                <div className="mt-2 text-center pb-1">
                  Vui lòng đăng nhập dể sử dụng
                </div>
                <div
                  className="flex p-3 gap-3 items-center border-2 rounded-md mt-3 cursor-pointer hover:bg-neutral-600"
                  onClick={() => googleLogin()}
                >
                  <Image
                    src="/google-logo.svg"
                    alt="Google Logo"
                    width={20}
                    height={20}
                  />
                  <div className="text-xs text-white font-medium">
                    Đăng nhập bằng Google
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SignInDialog;
