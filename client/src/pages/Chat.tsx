import Contacts from "@/components/chat/Contacts";
import checkAuth from "@/lib/checkAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
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
      <div className="flex flex-col md:flex-row gap-5">
        <div className="bg-primary-foreground px-3 py-2 rounded-md md:w-[30%] w-full self-start">
          <Contacts />
        </div>

        <div className=" rounded-md md:w-[70%] px-3 md:px-10 md:py-10 md:mt-10 md:mx-20 self-start flex items-center justify-between">
          <h3 className="font-bold text-3xl text-center">
            Select a chat to begin or read the conversation
          </h3>
        </div>
      </div>
    </>
  );
};

export default Chat;
