export interface AIConversation {
  id: string;
  user_id: string;
  module_id: string | null;
  conversation_context: string | null;
  messages: AIMessage[];
  created_at: Date;
  updated_at: Date;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  module_id?: string;
  context?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
}

export interface PromptTemplate {
  id: string;
  module_id: string | null;
  title: string;
  prompt: string;
  category: string;
}
