# FAA Aviation Study Quiz App

A comprehensive chapter-by-chapter quiz app for student pilots, covering:

- **PHAK** — Pilot's Handbook of Aeronautical Knowledge (FAA-H-8083-25B), 17 chapters
- **AFH** — Airplane Flying Handbook (FAA-H-8083-3C), 16 chapters

## Features

- Select handbook and chapter by name/number
- 25+ multiple-choice questions per chapter
- Key term callouts on each question
- Immediate answer feedback with explanations
- Results with score, pass/fail (70% threshold), and time
- Review all answers with correct/incorrect highlighting
- **Retry missed questions** — a shorter test of only the questions you got wrong
- **Print a completion report** (opens print dialog)
- **Email results** (via SMTP or mailto fallback)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Email Configuration (optional)

Copy `.env.local.example` to `.env.local` and fill in your SMTP credentials.
Without SMTP configured, the "Email Results" button opens your default email
client via a `mailto:` link with the results pre-filled.

## Tech Stack

- [Next.js 15](https://nextjs.org/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- Nodemailer (optional SMTP)

## Based On

- FAA-H-8083-25B — Pilot's Handbook of Aeronautical Knowledge
- FAA-H-8083-3C — Airplane Flying Handbook

Both are FAA public domain documents. For study purposes only — always refer to the official publications.
