import { LogOut, LucideIcon, Projector, Wallet } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSidebar } from "../ui/sidebar";
import { UserDetailContext } from "@/app/context/UserDetailContext"; // Import UserDetailContext

interface SidebarOptionType {
  name: string;
  icon: LucideIcon;
  path?: string;
  action?: () => void; 
}

function SidebarItemFooter() {
  const router = useRouter();
  const { setOpen } = useSidebar();
  const userDetailContext = useContext(UserDetailContext);

  if (!userDetailContext) {
    throw new Error("UserDetailContext is not available");
  }

  const { setUserDetail } = userDetailContext;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user"); 
    }
    setUserDetail(null);
    router.push("/"); 
    setOpen(false); 
  };

  const options: SidebarOptionType[] = [
    { name: "Sản phẩm", icon: Projector },
    { name: "Bảng giá dịch vụ", icon: Wallet, path: "/pricing" },
    { name: "Đăng xuất", icon: LogOut, action: handleLogout },
  ];

  const onOptionClick = (op: SidebarOptionType) => {
    if (op.path) {
      router.push(op.path);
      setOpen(false);
    } else if (op.action) {
      op.action();
    }
  };

  return (
    <div className="py-4 px-2">
      {options.map((op, index) => (
        <Button
          variant="ghost"
          className="w-full flex justify-start my-2"
          key={index}
          onClick={() => onOptionClick(op)}
        >
          <op.icon className="mr-2" /> {op.name}
        </Button>
      ))}
    </div>
  );
}

export default SidebarItemFooter;
