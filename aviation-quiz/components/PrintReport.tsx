'use client';

import { QuizQuestion } from '@/data/types';

interface ReportData {
  studentName: string;
  bookTitle: string;
  chapterTitle: string;
  chapterNumber: number;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timeElapsed: number;
  date: string;
  questions: QuizQuestion[];
  answers: (number | null)[];
}

export function generatePrintHTML(data: ReportData): string {
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m} min ${sec} sec`;
  };

  const wrongItems = data.questions
    .map((q, i) => ({ q, userAnswer: data.answers[i] }))
    .filter(({ q, userAnswer }) => userAnswer !== q.correctAnswer);

  const wrongHTML = wrongItems.length > 0
    ? `<div class="section">
        <h3>Missed Questions</h3>
        ${wrongItems.map(({ q, userAnswer }, idx) => `
          <div class="wrong-item">
            <p class="question"><strong>Q${idx + 1}:</strong> ${q.question}</p>
            <p class="your-answer">Your answer: ${userAnswer !== null ? q.options[userAnswer] : 'Not answered'}</p>
            <p class="correct-answer">Correct answer: ${q.options[q.correctAnswer]}</p>
            <p class="explanation">${q.explanation}</p>
          </div>
        `).join('')}
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Aviation Quiz Report — ${data.studentName}</title>
  <style>
    @page { size: letter; margin: 1in; }
    * { box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; font-size: 12pt; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1e40af; padding-bottom: 16px; margin-bottom: 24px; }
    .header-left h1 { font-size: 20pt; color: #1e40af; margin: 0 0 4px 0; }
    .header-left p { color: #555; margin: 0; font-size: 10pt; }
    .header-right { text-align: right; }
    .seal { width: 80px; height: 80px; border-radius: 50%; border: 4px solid #16a34a; display: flex; align-items: center; justify-content: center; text-align: center; background: #f0fdf4; }
    .seal-passed { color: #16a34a; font-weight: bold; font-size: 9pt; }
    .seal-failed { color: #dc2626; font-weight: bold; font-size: 9pt; width: 80px; height: 80px; border-radius: 50%; border: 4px solid #dc2626; display: flex; align-items: center; justify-content: center; text-align: center; background: #fef2f2; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .stat-box { border: 1px solid #ddd; border-radius: 8px; padding: 12px; text-align: center; }
    .stat-value { font-size: 20pt; font-weight: 900; }
    .stat-label { font-size: 9pt; color: #666; margin-top: 2px; }
    .green { color: #16a34a; }
    .red { color: #dc2626; }
    .blue { color: #1d4ed8; }
    .section { margin-bottom: 24px; }
    .section h3 { font-size: 13pt; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 12px; color: #1e40af; }
    .info-row { display: flex; gap: 8px; margin-bottom: 6px; font-size: 11pt; }
    .info-label { font-weight: bold; min-width: 140px; color: #444; }
    .wrong-item { border: 1px solid #fed7aa; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; background: #fff7ed; }
    .question { font-weight: 600; margin: 0 0 4px 0; }
    .your-answer { color: #dc2626; margin: 2px 0; font-size: 10pt; }
    .correct-answer { color: #16a34a; margin: 2px 0; font-size: 10pt; font-weight: 600; }
    .explanation { color: #555; font-size: 10pt; margin: 4px 0 0 0; font-style: italic; }
    .footer { border-top: 1px solid #ddd; padding-top: 12px; text-align: center; font-size: 9pt; color: #888; margin-top: 32px; }
    .pass-banner { background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; text-align: center; }
    .pass-banner h2 { color: #16a34a; margin: 0 0 4px 0; font-size: 16pt; }
    .pass-banner p { color: #555; margin: 0; font-size: 10pt; }
    .fail-banner { background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; text-align: center; }
    .fail-banner h2 { color: #dc2626; margin: 0 0 4px 0; font-size: 16pt; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>Aviation Study Quiz Report</h1>
      <p>FAA Handbook Study Program</p>
    </div>
    <div class="header-right">
      ${data.passed
        ? `<div class="seal"><div class="seal-passed">✓ PASSED</div></div>`
        : `<div class="seal-failed">✗ NOT PASSED</div>`}
    </div>
  </div>

  ${data.passed
    ? `<div class="pass-banner">
        <h2>✓ Chapter Completed Successfully</h2>
        <p>${data.studentName} has demonstrated satisfactory knowledge of the chapter material.</p>
      </div>`
    : `<div class="fail-banner">
        <h2>Additional Study Required</h2>
      </div>`}

  <div class="section">
    <div class="info-row"><span class="info-label">Student Name:</span><span>${data.studentName || 'Not provided'}</span></div>
    <div class="info-row"><span class="info-label">Date:</span><span>${data.date}</span></div>
    <div class="info-row"><span class="info-label">Handbook:</span><span>${data.bookTitle}</span></div>
    <div class="info-row"><span class="info-label">Chapter:</span><span>Chapter ${data.chapterNumber} — ${data.chapterTitle}</span></div>
    <div class="info-row"><span class="info-label">Time to Complete:</span><span>${formatTime(data.timeElapsed)}</span></div>
  </div>

  <div class="grid">
    <div class="stat-box">
      <div class="stat-value ${data.passed ? 'green' : 'red'}">${data.percentage}%</div>
      <div class="stat-label">Score</div>
    </div>
    <div class="stat-box">
      <div class="stat-value green">${data.score}</div>
      <div class="stat-label">Correct Answers</div>
    </div>
    <div class="stat-box">
      <div class="stat-value red">${data.total - data.score}</div>
      <div class="stat-label">Missed</div>
    </div>
  </div>

  ${wrongHTML}

  <div class="footer">
    <p>This report was generated by the FAA Aviation Study Quiz App.</p>
    <p>Based on FAA Handbooks — Public Domain Educational Material.</p>
  </div>
</body>
</html>`;
}
