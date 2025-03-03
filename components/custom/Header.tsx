import Image from "next/image";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import SignInDialog from "./SignInDialog";

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const userDetailContext = useContext(UserDetailContext);

  if (!userDetailContext) {
    throw new Error("2");
  }

  const { userDetail } = userDetailContext;

  return (
    <div className="p-4 flex justify-between items-center">
      <div className="flex items-end  font-bold textt-lg">
        <Image src={"/logo.png"} alt="Logo" width={40} height={40} />
        eact <span className="text-xl font-bold pl-1">AI</span>
      </div>
      <div className="flex gap-4">
        {userDetail ? (
          <Image
            src={userDetail?.picture || "/logo.png"}
            alt="user"
            width={35}
            height={35}
            className="rounded-full"
          />
        ) : (
          <>
            <Button onClick={() => setOpenDialog(true)}>Đăng nhập</Button>
            <SignInDialog open={openDialog} close={(e) => setOpenDialog(e)} />
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
