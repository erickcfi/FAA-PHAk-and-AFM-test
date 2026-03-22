'use client';

import { Book } from '@/data/types';

interface Props {
  books: Book[];
  selectedBookId: string | null;
  onSelect: (bookId: string) => void;
}

export default function BookSelector({ books, selectedBookId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {books.map((book) => {
        const isSelected = selectedBookId === book.id;
        const borderColor = book.coverColor === 'blue'
          ? 'border-blue-600'
          : 'border-red-600';
        const bgSelected = book.coverColor === 'blue'
          ? 'bg-blue-50 border-blue-600 shadow-blue-200'
          : 'bg-red-50 border-red-600 shadow-red-200';
        const headerBg = book.coverColor === 'blue'
          ? 'bg-blue-700'
          : 'bg-red-700';
        const badgeBg = book.coverColor === 'blue'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-red-100 text-red-800';

        return (
          <button
            key={book.id}
            onClick={() => onSelect(book.id)}
            className={`rounded-2xl border-2 overflow-hidden text-left shadow-md transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
              isSelected ? `${bgSelected} shadow-lg scale-[1.02]` : `border-gray-200 bg-white`
            }`}
          >
            <div className={`${headerBg} text-white px-6 py-4`}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-1 opacity-80">
                FAA Handbook
              </div>
              <h2 className="text-xl font-bold leading-tight">{book.shortTitle}</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-3">{book.description}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeBg}`}>
                  {book.chapters.length} Chapters
                </span>
                <span className="text-xs text-gray-400">
                  {book.chapters.reduce((sum, ch) => sum + ch.questions.length, 0)} Questions
                </span>
              </div>
            </div>
            {isSelected && (
              <div className={`px-6 pb-3 text-sm font-semibold ${book.coverColor === 'blue' ? 'text-blue-700' : 'text-red-700'}`}>
                ✓ Selected — choose a chapter below
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
