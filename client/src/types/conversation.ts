export interface Conversation {
  id: string;
  memberOneId: string;
  memberTwoId: string;
}

interface UserDetails {
  userId: string;
  userName: string;
  name: string;
}
export interface ConversationWithUserDetails extends Conversation {
  memberOne: UserDetails;
  memberTwo: UserDetails;
}
