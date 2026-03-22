import { Book, Chapter, QuizQuestion } from './types';
import { phakBook } from './phak';
import { afhBook } from './afh';

export const books: Book[] = [phakBook, afhBook];

export function getBook(bookId: string): Book | undefined {
  return books.find((b) => b.id === bookId);
}

export function getChapter(bookId: string, chapterId: string): Chapter | undefined {
  const book = getBook(bookId);
  return book?.chapters.find((c) => c.id === chapterId);
}

export function getQuestions(bookId: string, chapterId: string): QuizQuestion[] {
  const chapter = getChapter(bookId, chapterId);
  return chapter?.questions ?? [];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export { Book, Chapter, QuizQuestion };
