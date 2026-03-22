'use client';

import { useState } from 'react';
import { books, shuffleArray } from '@/data/index';
import { QuizQuestion, Book, Chapter } from '@/data/types';
import BookSelector from '@/components/BookSelector';
import ChapterSelector from '@/components/ChapterSelector';
import QuizEngine from '@/components/QuizEngine';
import ResultsPanel from '@/components/ResultsPanel';
import { generatePrintHTML } from '@/components/PrintReport';

type Stage = 'select' | 'quiz' | 'results';

interface ActiveQuiz {
  book: Book;
  chapter: Chapter;
  questions: QuizQuestion[];
  isRetry: boolean;
}

interface CompletedQuiz extends ActiveQuiz {
  answers: (number | null)[];
  timeElapsed: number;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>('select');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null);
  const [completedQuiz, setCompletedQuiz] = useState<CompletedQuiz | null>(null);

  const selectedBook = books.find((b) => b.id === selectedBookId) ?? null;

  const handleChapterSelect = (chapterId: string) => {
    if (!selectedBook) return;
    const chapter = selectedBook.chapters.find((c) => c.id === chapterId);
    if (!chapter) return;
    const shuffled = shuffleArray(chapter.questions);
    setActiveQuiz({ book: selectedBook, chapter, questions: shuffled, isRetry: false });
    setStage('quiz');
  };

  const handleQuizComplete = (answers: (number | null)[], timeElapsed: number) => {
    if (!activeQuiz) return;
    setCompletedQuiz({ ...activeQuiz, answers, timeElapsed });
    setStage('results');
  };

  const handleRetryMissed = (missedQuestions: QuizQuestion[]) => {
    if (!completedQuiz) return;
    const shuffled = shuffleArray(missedQuestions);
    setActiveQuiz({
      book: completedQuiz.book,
      chapter: completedQuiz.chapter,
      questions: shuffled,
      isRetry: true,
    });
    setStage('quiz');
  };

  const handleStartOver = () => {
    setStage('select');
    setActiveQuiz(null);
    setCompletedQuiz(null);
  };

  const handlePrintReport = (studentName: string) => {
    if (!completedQuiz) return;
    const correct = completedQuiz.answers.filter(
      (a, i) => a === completedQuiz.questions[i]?.correctAnswer
    ).length;
    const total = completedQuiz.questions.length;
    const percentage = Math.round((correct / total) * 100);

    const html = generatePrintHTML({
      studentName,
      bookTitle: completedQuiz.book.title,
      chapterTitle: completedQuiz.chapter.title,
      chapterNumber: completedQuiz.chapter.number,
      score: correct,
      total,
      percentage,
      passed: percentage >= 70,
      timeElapsed: completedQuiz.timeElapsed,
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      }),
      questions: completedQuiz.questions,
      answers: completedQuiz.answers,
    });

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 500);
    }
  };

  const handleEmailReport = async (studentName: string, email: string) => {
    if (!completedQuiz) return;
    const correct = completedQuiz.answers.filter(
      (a, i) => a === completedQuiz.questions[i]?.correctAnswer
    ).length;
    const total = completedQuiz.questions.length;
    const percentage = Math.round((correct / total) * 100);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          studentName,
          bookTitle: completedQuiz.book.title,
          chapterTitle: completedQuiz.chapter.title,
          score: correct,
          total,
          percentage,
          passed: percentage >= 70,
          timeElapsed: completedQuiz.timeElapsed,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          }),
        }),
      });
      const data = await res.json();
      if (data.mailtoLink) {
        window.location.href = data.mailtoLink;
      } else if (data.success) {
        alert(`Results sent to ${email}`);
      }
    } catch {
      alert('Failed to send email. Please try again.');
    }
  };

  const accentColor = (selectedBook?.coverColor === 'red' ? 'red' : 'blue') as 'blue' | 'red';
  const quizAccent = (activeQuiz?.book.coverColor === 'red' ? 'red' : 'blue') as 'blue' | 'red';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">✈</div>
            <div>
              <div className="font-black text-gray-800 text-base leading-tight">
                FAA Aviation Study Quiz
              </div>
              <div className="text-xs text-gray-400">PHAK &amp; AFH Chapter Practice Tests</div>
            </div>
          </div>
          {stage !== 'select' && (
            <button
              onClick={handleStartOver}
              className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
            >
              ← Home
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* SELECTION STAGE */}
        {stage === 'select' && (
          <div className="space-y-10">
            <div className="text-center">
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                Aviation Knowledge Quiz
              </h1>
              <p className="text-gray-500 max-w-xl mx-auto text-sm">
                Comprehensive chapter-by-chapter practice tests based on the FAA
                Pilot&apos;s Handbook of Aeronautical Knowledge (PHAK) and the
                Airplane Flying Handbook (AFH).
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                Step 1 — Select a Handbook
              </h2>
              <BookSelector
                books={books}
                selectedBookId={selectedBookId}
                onSelect={setSelectedBookId}
              />
            </div>

            {selectedBook && (
              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Step 2 — Select a Chapter
                </h2>
                <ChapterSelector book={selectedBook} onSelect={handleChapterSelect} />
              </div>
            )}
          </div>
        )}

        {/* QUIZ STAGE */}
        {stage === 'quiz' && activeQuiz && (
          <QuizEngine
            questions={activeQuiz.questions}
            chapterTitle={`Chapter ${activeQuiz.chapter.number}: ${activeQuiz.chapter.title}`}
            bookTitle={activeQuiz.book.shortTitle}
            accentColor={quizAccent}
            isRetry={activeQuiz.isRetry}
            onComplete={handleQuizComplete}
            onCancel={handleStartOver}
          />
        )}

        {/* RESULTS STAGE */}
        {stage === 'results' && completedQuiz && (
          <ResultsPanel
            questions={completedQuiz.questions}
            answers={completedQuiz.answers}
            timeElapsed={completedQuiz.timeElapsed}
            chapterTitle={`Chapter ${completedQuiz.chapter.number}: ${completedQuiz.chapter.title}`}
            bookTitle={completedQuiz.book.shortTitle}
            accentColor={quizAccent}
            isRetry={completedQuiz.isRetry}
            onRetryMissed={handleRetryMissed}
            onStartOver={handleStartOver}
            onPrintReport={handlePrintReport}
            onEmailReport={handleEmailReport}
          />
        )}
      </main>

      <footer className="border-t border-gray-200 mt-16 py-6 text-center text-xs text-gray-400">
        Based on FAA-H-8083-25B (PHAK) and FAA-H-8083-3C (AFH) — Public Domain Educational Material.
        For study purposes only. Always refer to official FAA publications.
      </footer>
    </div>
  );
}
