export interface User {
  id: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  role: 'user' | 'admin';
  created_at: string;
  token?: string;
}

export interface Exam {
  id: string;
  subject: string;
  form?: string;
  year: number;
  season?: 'winter' | 'summer';
  exam_file_url: string;
  solution_file_url: string;
  solution_video_url: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  created_at?: string;
}

export interface ExamForm {
  id: string;
  subject_id: string;
  name: string;
  created_at?: string;
}

export interface Comment {
  id: string;
  exam_id: string;
  user_id: string;
  user_name: string;
  user_role: 'user' | 'admin';
  content: string;
  image_url?: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  recipient_id: string;
  recipient_name: string;
  subject: string;
  content: string;
  attachment_url?: string;
  attachment_name?: string;
  is_read: boolean;
  created_at: string;
}

export interface QuestionSolution {
  id: string;
  exam_id: string;
  question_number: number;
  solution_video_url?: string;
  solution_text?: string;
  created_at: string;
}

export interface ActiveRoom {
  id: string;
  hostId: string;
  hostName: string;
  participants: number;
  created_at: string;
  title?: string;
  isPrivate?: boolean;
}

export interface JoinRequest {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface FileExplorerItem {
  id: string;
  name: string;
  type: 'folder' | 'word' | 'excel' | 'powerpoint' | 'pdf';
  size?: number;
  created_at: string;
  parent_id?: string | null;
  user_id: string;
  file_url?: string;
}