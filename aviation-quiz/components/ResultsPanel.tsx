'use client';

import { useState, useRef } from 'react';
import { QuizQuestion } from '@/data/types';

interface Props {
  questions: QuizQuestion[];
  answers: (number | null)[];
  timeElapsed: number;
  chapterTitle: string;
  bookTitle: string;
  accentColor: 'blue' | 'red';
  isRetry?: boolean;
  onRetryMissed: (missedQuestions: QuizQuestion[]) => void;
  onStartOver: () => void;
  onPrintReport: (studentName: string) => void;
  onEmailReport: (studentName: string, email: string) => void;
}

export default function ResultsPanel({
  questions,
  answers,
  timeElapsed,
  chapterTitle,
  bookTitle,
  accentColor,
  isRetry = false,
  onRetryMissed,
  onStartOver,
  onPrintReport,
  onEmailReport,
}: Props) {
  const [showReview, setShowReview] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [reportAction, setReportAction] = useState<'print' | 'email' | null>(null);

  const correct = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = percentage >= 70;
  const missedQuestions = questions.filter((q, i) => answers[i] !== q.correctAnswer);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const handleReportClick = (action: 'print' | 'email') => {
    setReportAction(action);
    setShowNameModal(true);
  };

  const handleNameConfirm = () => {
    setShowNameModal(false);
    if (reportAction === 'print') {
      onPrintReport(studentName);
    } else if (reportAction === 'email') {
      setShowEmailModal(true);
    }
  };

  const handleEmailConfirm = () => {
    setShowEmailModal(false);
    onEmailReport(studentName, emailAddress);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Score Card */}
      <div className={`rounded-2xl overflow-hidden shadow-lg border ${
        passed ? 'border-green-200' : 'border-red-200'
      } mb-6`}>
        <div className={`px-6 py-5 ${passed ? 'bg-green-600' : 'bg-red-500'} text-white`}>
          <div className="text-sm font-semibold opacity-80 mb-1">{bookTitle}</div>
          <h2 className="text-xl font-bold">{chapterTitle}</h2>
          {isRetry && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">
              Retry Quiz
            </span>
          )}
        </div>

        <div className="bg-white px-6 py-6">
          {/* Big score */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className={`text-6xl font-black ${passed ? 'text-green-600' : 'text-red-500'}`}>
                {percentage}%
              </div>
              <div className={`text-lg font-bold mt-1 ${passed ? 'text-green-700' : 'text-red-600'}`}>
                {passed ? '✓ PASSED' : '✗ NOT PASSED'}
              </div>
              <div className="text-sm text-gray-500">Minimum passing score: 70%</div>
            </div>
            {/* Circular indicator */}
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={passed ? '#16a34a' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${percentage} ${100 - percentage}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-gray-800">{correct}</span>
                <span className="text-xs text-gray-400">/ {total}</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{correct}</div>
              <div className="text-xs text-gray-500 mt-0.5">Correct</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-red-500">{total - correct}</div>
              <div className="text-xs text-gray-500 mt-0.5">Missed</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-gray-700">{formatTime(timeElapsed)}</div>
              <div className="text-xs text-gray-500 mt-0.5">Time</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowReview(!showReview)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 border-${accentColor}-200 text-${accentColor}-700 hover:bg-${accentColor}-50 transition-all`}
            >
              {showReview ? 'Hide Review' : '📋 Review Answers'}
            </button>
            {missedQuestions.length > 0 && !isRetry && (
              <button
                onClick={() => onRetryMissed(missedQuestions)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all"
              >
                🔄 Retry Missed ({missedQuestions.length})
              </button>
            )}
          </div>

          {passed && (
            <div className="flex flex-wrap gap-3 mt-3">
              <button
                onClick={() => handleReportClick('print')}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gray-800 text-white hover:bg-gray-900 transition-all"
              >
                🖨 Print Report
              </button>
              <button
                onClick={() => handleReportClick('email')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold bg-${accentColor}-600 text-white hover:bg-${accentColor}-700 transition-all`}
              >
                ✉ Email Results
              </button>
            </div>
          )}

          <button
            onClick={onStartOver}
            className="w-full mt-3 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Review Section */}
      {showReview && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Answer Review</h3>
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-4 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className={`text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? '✓' : '✗'} Q{i + 1}
                  </span>
                  {q.keyTerm && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                      {q.keyTerm}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-2">{q.question}</p>
                {q.imageUrl && (
                  <img src={q.imageUrl} alt={q.imageCaption ?? ''} className="w-full max-h-48 object-contain rounded-lg mb-2 border border-gray-200" />
                )}
                <div className="space-y-1 mb-3">
                  {q.options.map((opt, j) => (
                    <div
                      key={j}
                      className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 ${
                        j === q.correctAnswer
                          ? 'bg-green-200 text-green-800 font-semibold'
                          : j === userAnswer && !isCorrect
                          ? 'bg-red-200 text-red-800'
                          : 'bg-white text-gray-600'
                      }`}
                    >
                      <span className="font-bold">{['A','B','C','D'][j]}.</span>
                      {opt}
                      {j === q.correctAnswer && ' ✓'}
                      {j === userAnswer && !isCorrect && ' ✗ (your answer)'}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 italic">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 text-lg mb-3">Enter Your Name</h3>
            <p className="text-sm text-gray-500 mb-4">
              This will appear on your completion report.
            </p>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Full name"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={(e) => e.key === 'Enter' && handleNameConfirm()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNameModal(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleNameConfirm}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 text-lg mb-3">Email Results</h3>
            <p className="text-sm text-gray-500 mb-4">
              Send your quiz results to an email address.
            </p>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="email@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={(e) => e.key === 'Enter' && handleEmailConfirm()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailConfirm}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
