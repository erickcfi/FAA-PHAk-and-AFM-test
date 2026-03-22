'use client';

import { useState, useCallback } from 'react';
import { QuizQuestion } from '@/data/types';
import Image from 'next/image';

interface Props {
  questions: QuizQuestion[];
  chapterTitle: string;
  bookTitle: string;
  accentColor: 'blue' | 'red';
  isRetry?: boolean;
  onComplete: (answers: (number | null)[], timeElapsed: number) => void;
  onCancel: () => void;
}

export default function QuizEngine({
  questions,
  chapterTitle,
  bookTitle,
  accentColor,
  isRetry = false,
  onComplete,
  onCancel,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [startTime] = useState(Date.now());
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const answered = answers.filter((a) => a !== null).length;

  const handleSelect = (idx: number) => {
    if (confirmed) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
    setConfirmed(true);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(answers[current + 1]);
      setConfirmed(answers[current + 1] !== null);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(answers[current - 1]);
      setConfirmed(answers[current - 1] !== null);
    }
  };

  const handleSubmit = () => {
    onComplete(answers, Math.floor((Date.now() - startTime) / 1000));
  };

  const optionLabel = (i: number) => ['A', 'B', 'C', 'D'][i];

  const optionStyle = (i: number) => {
    const base =
      'flex items-start gap-3 w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150 cursor-pointer';
    if (!confirmed) {
      if (selected === i)
        return `${base} border-${accentColor}-500 bg-${accentColor}-50 shadow-sm`;
      return `${base} border-gray-200 bg-white hover:border-${accentColor}-300 hover:bg-${accentColor}-50`;
    }
    // After confirmation
    if (i === question.correctAnswer)
      return `${base} border-green-500 bg-green-50`;
    if (selected === i && i !== question.correctAnswer)
      return `${base} border-red-400 bg-red-50`;
    return `${base} border-gray-200 bg-white opacity-60`;
  };

  const unansweredCount = answers.filter((a) => a === null).length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">{bookTitle}</span>
            <h1 className="font-bold text-gray-800 text-lg">{chapterTitle}</h1>
            {isRetry && (
              <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full">
                Retry — Missed Questions
              </span>
            )}
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Cancel
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-${accentColor}-500 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {current + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-4">
        {/* Question number + key term */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${accentColor}-100 text-${accentColor}-700`}>
            Q{current + 1}
          </span>
          {question.keyTerm && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
              Key Term: {question.keyTerm}
            </span>
          )}
        </div>

        {/* Question image */}
        {question.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden border border-gray-200">
            <img
              src={question.imageUrl}
              alt={question.imageCaption ?? 'Question diagram'}
              className="w-full object-contain max-h-64"
            />
            {question.imageCaption && (
              <p className="text-xs text-gray-500 text-center py-1 bg-gray-50">
                {question.imageCaption}
              </p>
            )}
          </div>
        )}

        <p className="text-gray-800 font-semibold text-base leading-relaxed mb-5">
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <button key={i} className={optionStyle(i)} onClick={() => handleSelect(i)}>
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center
                  ${
                    confirmed && i === question.correctAnswer
                      ? 'bg-green-500 text-white'
                      : confirmed && selected === i && i !== question.correctAnswer
                      ? 'bg-red-400 text-white'
                      : selected === i && !confirmed
                      ? `bg-${accentColor}-500 text-white`
                      : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {optionLabel(i)}
              </span>
              <span className="text-sm text-gray-700 leading-snug">{opt}</span>
            </button>
          ))}
        </div>

        {/* Confirm button */}
        {!confirmed && (
          <div className="mt-4">
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-150
                ${
                  selected !== null
                    ? `bg-${accentColor}-600 text-white hover:bg-${accentColor}-700 active:scale-95`
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              Confirm Answer
            </button>
          </div>
        )}

        {/* Explanation */}
        {confirmed && (
          <div className={`mt-4 p-4 rounded-xl border ${
            selected === question.correctAnswer
              ? 'bg-green-50 border-green-200'
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm font-bold">
                {selected === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
              </span>
            </div>
            <p className="text-sm text-gray-700">{question.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-2">
          {/* Dot navigation for smaller quizzes */}
          {questions.length <= 20 && (
            <div className="hidden sm:flex gap-1">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrent(i);
                    setSelected(answers[i]);
                    setConfirmed(answers[i] !== null);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current
                      ? `bg-${accentColor}-500 scale-125`
                      : answers[i] !== null
                      ? 'bg-gray-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {current < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-${accentColor}-600 text-white hover:bg-${accentColor}-700 active:scale-95`}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 active:scale-95 transition-all"
          >
            Submit Quiz
          </button>
        )}
      </div>

      {/* Submit confirmation modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Submit Quiz?</h3>
            {unansweredCount > 0 && (
              <p className="text-orange-600 text-sm mb-3">
                ⚠ You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}.
              </p>
            )}
            <p className="text-gray-600 text-sm mb-5">
              {answered} of {questions.length} questions answered.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Go Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
