export type Messages = {
  member: {
    userId: string;
    userName: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
  conversation: {
    id: string;
    memberOneId: string;
    memberTwoId: string;
  };
} & {
  id: string;
  content: string;
  fileUrl: string | null;
  memberId: string;
  conversationId: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};
