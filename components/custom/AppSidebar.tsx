import { MessageCircleCode } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "../ui/button";
import WorkspaceHistory from "./WorkspaceHistory";
import SidebarItemFooter from "./SidebarItemFooter";
import { usePathname, useRouter } from "next/navigation";

export function AppSidebar() {
  const pathName = usePathname();
  const router = useRouter();
  const { setOpen } = useSidebar();

  const onNewWorkspace = () => {
    router.push("/");
    setOpen(false);
  };

  return (
    <Sidebar className="!h-full">
      <SidebarHeader>
        <div className="flex items-end pl-2 font-bold textt-lg">
          {" "}
          <Image src={"/logo.png"} alt="Logo" width={40} height={40} />
          eact <span className="text-xl font-bold pl-1">AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4 !h-full">
        {pathName !== "/" && (
          <Button className="text-xs" onClick={onNewWorkspace}>
            <MessageCircleCode /> Bắt đầu cuộc trò truyện mới
          </Button>
        )}
        <SidebarGroup className="hide-scrollbar">
          <WorkspaceHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarItemFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
