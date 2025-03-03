export interface UserDetail {
  _id?: string ;
  sub?: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture: string;
  email: string;
  email_verified?: boolean;
  locale?: string;
  token?: number
}

  
  export interface UserDetailContextType {
    userDetail: UserDetail | null;
    setUserDetail: React.Dispatch<React.SetStateAction<UserDetail | null>>;
  }
  
  export interface Message {
    role: string;
    content: string;
  }
  
  export interface MessagesContextType {
    messages: Message[]; 
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  }

  export interface ActionType {
    actionType: string,
    timestamp: number
  }
  