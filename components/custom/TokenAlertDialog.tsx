import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

function TokenAlertDialog({
  open,
  close,
}: {
  open: boolean;
  close: (e: boolean) => void;
}) {
  const router = useRouter();
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
                Số lượng token quá bạn không đủ để thực hiên yêu cầu
              <Button onClick={() => router.push("/pricing")}>
                Bổ sung ngay
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TokenAlertDialog;
