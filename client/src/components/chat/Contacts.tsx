import { useModal } from "@/hooks/useModal";
import useAuthStore from "@/store/useAuth";
import { ConversationWithUserDetails } from "@/types/conversation";
import { Link, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import useConversation from "@/hooks/useConversation";
import { Trash } from "lucide-react";

function displayInfo(
  conversation: ConversationWithUserDetails,
  userId: string
) {
  let userDetails = {
    name: "",
    userId: "",
    userName: "",
  };
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

const Contacts = () => {
  const { onOpen } = useModal();
  const { conversationId } = useParams();

  const { user } = useAuthStore();

  const { conversations } = useConversation();

  if (!user) {
    return null;
  }

  const onDelete = (id: string) => {
    onOpen("deleteConversation", { conversationId: id });
  };
  return (
    <div>
      <div className="my-5">
        <h3 className="font-bold text-center text-2xl">Your Conversations</h3>
        <Button
          onClick={() => onOpen("createConversation")}
          className="w-full my-5"
        >
          Add New
        </Button>
        <div className="my-5 flex gap-3 flex-col ">
          {conversations?.map((conversation) => (
            <div
              key={conversation.id}
              className={`text-white ${
                conversation.id === conversationId
                  ? "bg-slate-800"
                  : "bg-gray-600/60 "
              }   rounded-md flex justify-between `}
            >
              <Link
                to={`/conversation/${conversation.id}`}
                key={conversation.id}
                className="flex  w-[95%] px-3 py-2 h-full"
              >
                <p className="text-left mr-1">
                  {displayInfo(conversation, user.userId).name}
                </p>

                <span className="font-medium">
                  (@{displayInfo(conversation, user.userId).userName})
                </span>
              </Link>

              <div
                className="bg-red-500 px-3 py-2  w-auto rounded-tl-none rounded-tr-md rounded-bl-none rounded-br-md cursor-pointer flex items-center justify-center"
                onClick={() => onDelete(conversation.id)}
              >
                <Trash />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
