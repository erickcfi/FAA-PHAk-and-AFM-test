export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index into options
  explanation: string;
  keyTerm?: string;
  imageUrl?: string; // path to image in /public/images/
  imageCaption?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface Book {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  coverColor: string;
  chapters: Chapter[];
}

export interface QuizSession {
  bookId: string;
  chapterId: string;
  questions: QuizQuestion[];
  answers: (number | null)[];
  startTime: number;
  endTime?: number;
  isRetry?: boolean;
}

export interface QuizResult {
  session: QuizSession;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  wrongQuestionIds: string[];
  timeElapsed: number;
  studentName?: string;
  date: string;
}
