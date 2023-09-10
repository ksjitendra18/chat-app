import { useEffect, useState } from "react";
import AddFriend from "./modals/AddFriend";
import DeleteConversation from "./modals/DeleteConversation";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AddFriend />
      <DeleteConversation />
    </>
  );
};
