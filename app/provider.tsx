"use client";

import Header from "@/components/custom/Header";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MessagesContext } from "./context/MessagesContext";
import { useEffect, useState } from "react";
import { UserDetailContext } from "./context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Message, UserDetail } from "./types";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";

function Provider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const convex = useConvex();
  const router = useRouter()
  useEffect(() => {
    IsAuthenicated();
  }, []);

  const IsAuthenicated = async () => {
    if (typeof window !== undefined) {
      const user = JSON.parse(localStorage.getItem("user") as string);
      if(!user) {
        router.push('/')
        return
      }
      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });
      setUserDetail(result);
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY as string}
    >
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <MessagesContext.Provider value={{ messages, setMessages }}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <SidebarProvider defaultOpen={false}>
              <AppSidebar />
              {children}
              <Toaster />
            </SidebarProvider>
          </NextThemesProvider>
        </MessagesContext.Provider>
      </UserDetailContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default Provider;
