import useAuthStore from "@/store/useAuth";
import { ConversationWithUserDetails } from "@/types/conversation";

import Cookies from "js-cookie";
import { Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import NewMessage from "./NewMessage";
import { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

interface Data {
  message: string;
  conversationId: string;
  userName: string;
  userId: string;
}

function displayInfo(
  conversation: ConversationWithUserDetails | undefined,
  userId: string
) {
  let userDetails = {
    name: "",
    userId: "",
    userName: "",
  };
  if (!conversation) {
    return;
  }
  if (conversation.memberOne.userId === userId) {
    userDetails = {
      name: conversation.memberTwo.name,
      userId: conversation.memberTwo.userId,
      userName: conversation.memberTwo.userName,
    };
  } else {
    userDetails = {
      name: conversation.memberOne.name,
      userId: conversation.memberOne.userId,
      userName: conversation.memberOne.userName,
    };
  }
  return userDetails;
}

const Conversation = ({ io }: { io: Socket }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Data[]>([]);

  const { conversationId } = useParams();

  const authToken = Cookies.get("auth-token");

  const fetchConversation = async () => {
    const res = await fetch(
      `http://localhost:8000/conversation/${conversationId}`,
      {
        headers: { "auth-token": authToken! },
      }
    );
    const resData = await res.json();

    return resData.data;
  };
  const fetchMessage = async () => {
    const res = await fetch(`http://localhost:8000/message/${conversationId}`, {
      headers: { "auth-token": authToken! },
    });
    const resData = await res.json();

    return resData.data;
  };

  const {
    data: conversation,
    error,
    isLoading,
  } = useSWR<ConversationWithUserDetails>(
    `/conversation/${conversationId}`,
    fetchConversation
  );

  if (!conversation || conversation.length < 1) {
    navigate("/chat");
  }
  const {
    data: fetchedMessages,
    error: msgError,
    isLoading: msgIsLoading,
  } = useSWR(`/message/${conversationId}`, fetchMessage);

  useEffect(() => {
    if (!msgIsLoading) {
      setMessages(fetchedMessages);
    }
    if (fetchedMessages?.length) {
      console.log("scrolling");
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
    io.on("receive_message", (data: Data) => {
      console.log("rcvd", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      io.removeListener("receive_message");
    };
  }, [io, fetchedMessages, msgIsLoading]);

  console.log("message are", messages);
  if (!user) {
    return;
  }

  if (isLoading) {
    return (
      <>
        <Loader className="animate-spin" />
      </>
    );
  }

  console.log("here", user.userName);

  return (
    <>
      <h3 className="text-xl font-medium w-full px-5 py-2 bg-gray-700/30 flex ">
        <p className="mr-1">{displayInfo(conversation, user.userId)?.name}</p>
        <span>(@{displayInfo(conversation, user.userId)?.userName})</span>
      </h3>

      <div className="absolute bottom-0 bg-gray-600/90 w-full px-5">
        <NewMessage io={io} />
      </div>

      <div className="flex flex-col gap-4 overflow-x-hidden overflow-y-scroll px-5 py-4 h-full ">
        {messages.map((message, idx) => (
          <div
            className="chat-msg bg-blue-700 px-3 py-2 w-fit rounded-md"
            key={idx}
          >
            <p className="mb-1 text-gray-300">
              {message?.member?.userName ?? message.userName} said
            </p>
            {message?.content ?? message.message}
          </div>
        ))}
      </div>
    </>
  );
};

export default Conversation;
