export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  complete?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  saved: boolean;
}
