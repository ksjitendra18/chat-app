import Contacts from "@/components/chat/Contacts";
import ConversationComp from "@/components/chat/ConversationComp";
import checkAuth from "@/lib/checkAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

const Conversation = ({ io }: { io: Socket }) => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then((data) => {
      if (!data.success) {
        navigate("/login");
      }
    });
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-5 h-[100vh]">
        <div className="bg-primary-foreground px-3 py-2 rounded-md md:w-[30%] w-full self-start">
          <Contacts />
        </div>

        <div className="bg-primary-foreground rounded-md md:w-[70%] w-full h-[85%] relative overflow-hidden">
          <ConversationComp io={io} />
        </div>
      </div>
    </>
  );
};

export default Conversation;
