# AI Career Navigator

An AI-powered career platform that helps users build ATS-ready resumes, find matching jobs across major portals, and ace interviews with AI mock sessions.

---

## Project Structure

```
ai-career-nav/
├── frontend-app/     # Next.js 15 + TypeScript frontend
└── backend-app/      # Node.js + Express + MongoDB backend
```

---

## Frontend App (`frontend-app/`)

Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS v4**.

### Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, stats, three steps, job portals, CTA, footer |
| `/login` | Sign in with email & password, forgot password modal |
| `/register` | Create account — matches login page design |
| `/homepage` | Dashboard after login |
| `/resume-analyzer` | Upload & analyze resume with AI |
| `/career-navigator` | AI career path mapping |
| `/progress-tracker` | Track learning & career milestones |
| `/insights` | Personality & market trend insights |
| `/chatbot` | AI Chat Assistant with real-time message history modal |
| `/contact` | Get in Touch form — sends email via backend |
| `/upgrade` | Pricing plans — Basic (Free), Premium (₹499/mo), Pro (₹999/mo) |
| `/profile` | User profile management |
| `/account-settings` | Account settings |
| `/feedback` | Submit feedback |

### Key Components

- `ClientLayout.tsx` — wraps all pages, shows Sidebar + AppHeader + Footer for authenticated routes
- `Sidebar.tsx` — collapsible navigation with user menu and Upgrade to Pro button
- `AppHeader.tsx` — sticky top bar with notifications and profile avatar
- `Footer.tsx` — shared footer with product, career tools, company, and legal links

### Running the Frontend

```bash
cd frontend-app
npm install
npm run dev
```

Runs on `http://localhost:3000`

### Environment Variables (`frontend-app/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Backend App (`backend-app/`)

Built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **Google Gemini AI**.

### API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/profile` | Get user profile (auth required) |
| PUT | `/api/auth/profile` | Update user profile (auth required) |
| POST | `/api/contact` | Send contact form email via Nodemailer |
| POST | `/api/chat` | AI chat via Gemini |
| POST | `/api/resume` | Upload & analyze resume PDF |
| POST | `/api/assessment` | Submit skill assessment |
| GET | `/api/insights` | Get AI career insights |
| GET | `/api/resources` | Get learning resources |
| POST | `/api/job-matching` | Match jobs to user profile |

### Email (Contact Form)

Uses **Nodemailer** with Gmail SMTP. Set these in `.env`:

```env
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
```

> Use a Gmail App Password (not your regular password). Enable 2FA on your Google account first, then generate an App Password at myaccount.google.com/apppasswords.

### Running the Backend

```bash
cd backend-app
npm install
npm run dev
```

Runs on `http://localhost:5000`

### Environment Variables (`backend-app/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-career-nav
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password
```

---

## Pricing Plans

> ⚠️ Payment integration via **Razorpay** is pending — assigned to the team.

| Plan | Price | Key Features |
|---|---|---|
| Basic | Free | 3 resumes/mo, 5 templates, basic job search |
| Premium | ₹499/mo | Unlimited resumes, 50+ templates, 500+ questions, 10 AI interviews |
| Pro | ₹999/mo | Everything + unlimited AI interviews, real-voice agent, dedicated support |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| AI | Google Gemini API |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Gmail SMTP) |
| File Upload | Multer + pdf-parse |
| Icons | Lucide React |

---

## Development

Run both apps simultaneously:

```bash
# Terminal 1
cd backend-app && npm run dev

# Terminal 2
cd frontend-app && npm run dev
```

---

© 2025 CareerNav. Crafted to help you land your next role.
