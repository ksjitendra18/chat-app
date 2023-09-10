import { ConversationWithUserDetails } from "@/types/conversation";
import Cookies from "js-cookie";
import useSWR from "swr";

const authToken = Cookies.get("auth-token");

const fetchConversation = async () => {
  const res = await fetch("http://localhost:8000/conversation/all", {
    headers: { "auth-token": authToken! },
  });
  const resData = await res.json();

  return resData.data;
};

function useConversation() {
  const { data, error, isLoading } = useSWR<
    ConversationWithUserDetails[] | undefined
  >(`/conversation/${authToken}`, fetchConversation);

  return {
    conversations: data,
    isLoading,
    isError: error,
  };
}

export default useConversation;
