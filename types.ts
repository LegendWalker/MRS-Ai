
export enum View {
  Chat = 'chat',
  LiveTutor = 'live_tutor',
  ImageGen = 'image_gen',
  StudyPlan = 'study_plan'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string; // Base64 image data for display
  sources?: Array<{ title: string; uri: string }>;
}

export interface StudyStep {
  title: string;
  description: string;
  duration: string;
}

export interface StudyPlanResponse {
  topic: string;
  difficulty: string;
  steps: StudyStep[];
  learningObjectives: string[];
}
