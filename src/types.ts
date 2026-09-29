export type Role = 'user' | 'model' | 'system';

export interface Attachment {
  name: string;
  type: string;
  data: string; // base64 string
  mimeType: string;
  previewUrl?: string;
}

export interface CluePromptItem {
  id: string;
  type: 'stakeholder' | 'element' | 'competency' | '6c' | 'issue' | 'perspective' | 'refine' | 'other';
  title: string;
  description?: string;
  promptText: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  attachment?: Attachment;
  grade?: string;
  subject?: string;
  modeDetected?: 'typeA' | 'typeB' | 'overlay' | 'greeting';
}

export type SubjectDomain = 
  | 'auto'
  | 'math'
  | 'science'
  | 'chinese'
  | 'english'
  | 'native'
  | 'social';

export type GradeLevel =
  | 'unspecified'
  | '國小一～二年級'
  | '國小三～四年級'
  | '國小五～六年級'
  | '國中七年級'
  | '國中八年級'
  | '國中九年級'
  | '高中十年級（高一）'
  | '高中十一年級（高二）'
  | '高中十二年級（高三）'
  | '大專院校/成人教育';
