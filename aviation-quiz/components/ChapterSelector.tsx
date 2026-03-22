'use client';

import { Book, Chapter } from '@/data/types';

interface Props {
  book: Book;
  onSelect: (chapterId: string) => void;
}

export default function ChapterSelector({ book, onSelect }: Props) {
  const accentColor = book.coverColor === 'blue' ? 'blue' : 'red';

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Select a Chapter — <span className="font-normal text-gray-500">{book.shortTitle}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {book.chapters.map((chapter: Chapter) => (
          <button
            key={chapter.id}
            onClick={() => onSelect(chapter.id)}
            className={`group text-left rounded-xl border border-gray-200 bg-white p-4 shadow-sm
              hover:border-${accentColor}-400 hover:shadow-md hover:bg-${accentColor}-50
              transition-all duration-150 active:scale-95`}
          >
            <div className={`text-xs font-bold text-${accentColor}-600 mb-1`}>
              Chapter {chapter.number}
            </div>
            <div className="font-semibold text-gray-800 text-sm leading-snug mb-2">
              {chapter.title}
            </div>
            <div className="text-xs text-gray-400">
              {chapter.questions.length} questions
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
