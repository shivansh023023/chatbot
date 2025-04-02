export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface Settings {
  geminiApiKey: string;
}