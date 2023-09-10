import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/useModal";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Cookies from "js-cookie";

const DeleteConversation = () => {
  const { isOpen, type, onClose, data } = useModal();
  const navigate = useNavigate();

  console.log("here is data", data?.conversationId);

  const isModalOpen = isOpen && type === "deleteConversation";

  const handleClose = () => {
    onClose();
  };
  const authToken = Cookies.get("auth-token");

  async function onConfirm() {
    const res = await fetch(
      `http://localhost:8000/conversation/${data?.conversationId}`,
      {
        method: "delete",
        headers: { "auth-token": authToken! },
      }
    );

    const resData = await res.json();
    if (resData.success) {
      navigate(`/chat`);
      onClose();
    }
  }

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="  px-4 py-2 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Delete Conversation
            </DialogTitle>
          </DialogHeader>

          {/* <div className="w-full"> */}
          {/* <Button className="w-1/2 " variant={"ghost"}>
              Cancel
            </Button> */}
          <Button className="mb-5" variant={"destructive"} onClick={onConfirm}>
            Delete
          </Button>
          {/* </div> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteConversation;
