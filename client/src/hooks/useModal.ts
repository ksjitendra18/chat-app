import { create } from "zustand";

export type ModalType = "createConversation" | "deleteConversation";

interface ModalData {
  conversationId?: string;
  userName?: string;
  name?: string;
}

interface ModalStore {
  type: ModalType | null;
  data?: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
