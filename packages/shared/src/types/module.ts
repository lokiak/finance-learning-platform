export interface Module {
  id: string;
  phase_number: number;
  module_number: number;
  title: string;
  description: string | null;
  estimated_duration: number | null;
  order_index: number;
  prerequisites: string[];
  created_at: Date;
}

export interface ModuleContent {
  id: string;
  module_id: string;
  section_number: number;
  section_title: string;
  content_type: ContentType;
  content_data: ContentData;
  order_index: number;
  created_at: Date;
}

export type ContentType = 'text' | 'video' | 'interactive' | 'calculator' | 'ai_prompt';

export interface ContentData {
  body?: string;
  video_url?: string;
  calculator_type?: string;
  prompt_template?: string;
  instructions?: string;
  reflection_questions?: string[];
  key_takeaways?: string[];
  [key: string]: any;
}

export interface ModuleWithContent extends Module {
  content: ModuleContent[];
}

export interface ModuleWithProgress extends Module {
  progress: {
    status: ProgressStatus;
    progress_percentage: number;
    started_at: Date | null;
    completed_at: Date | null;
    last_accessed: Date | null;
    time_spent_minutes: number;
  } | null;
  is_locked: boolean;
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
