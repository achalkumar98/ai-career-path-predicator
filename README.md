# AI Career Navigator

An AI-powered career platform that helps users build ATS-ready resumes, find matching jobs across major portals, and ace interviews with AI mock sessions.

🌐 **Live Frontend**: [https://ai-career-path-predicator-tawny.vercel.app](https://ai-career-path-predicator-tawny.vercel.app)

🚀 **Live Backend**: [https://ai-career-path-predicator.onrender.com](https://ai-career-path-predicator.onrender.com)

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

- `ClientLayout.tsx` — wraps all pages, shows Sidebar + AppHeader + Footer for authenticated routes; includes client-side auth guard
- `Sidebar.tsx` — collapsible navigation with user menu and Upgrade to Pro button
- `AppHeader.tsx` — sticky top bar with avatar dropdown (profile, settings, sign out) and bell notification dropdown
- `Footer.tsx` — light-theme footer with brand column, social icons, 4 link columns (Product, Resources, Company, Legal)

### Running the Frontend

```bash
cd frontend-app
npm install
npm run dev
```

Runs on `http://localhost:3000`

### Environment Variables (`frontend-app/.env.local`)

```env
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/v1/
```

### Environment Variables (`frontend-app/.env.production`)

```env
NEXT_PUBLIC_BASE_API_URL=https://ai-career-path-predicator.onrender.com/api/
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Backend App (`backend-app/`)

Built with **Node.js**, **Express 5**, **MongoDB (Mongoose)**, and **Groq AI**.

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
| POST | `/api/chat` | AI chat via Groq |
| POST | `/api/resume` | Upload & analyze resume PDF |
| POST | `/api/assessment` | Submit skill assessment |
| GET | `/api/insights` | Get AI career insights |
| GET | `/api/resources` | Get learning resources |
| POST | `/api/job-matching` | Match jobs to user profile |

> Routes use `/v1/` prefix in development and `/api/` prefix in production (`NODE_ENV=production`).

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
Runs on `http://localhost:5000`

### Environment Variables (`backend-app/.env`)

```env
PORT=5000
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-career-nav
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password
CORS_ORIGIN=http://localhost:3000,https://ai-career-path-predicator-tawny.vercel.app
```

---

## Deployment

### Frontend — Vercel

1. Push `frontend-app/` to GitHub
2. Import repo in [vercel.com](https://vercel.com), set **Root Directory** to `frontend-app`
3. Add environment variable in Vercel dashboard:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_BASE_API_URL` | `https://ai-career-path-predicator.onrender.com/api/` |

### Backend — Render

1. Push `backend-app/` to GitHub
2. Create a new **Web Service** in [render.com](https://render.com), set **Root Directory** to `backend-app`
3. Set **Build Command**: `npm install` and **Start Command**: `npm start`
4. Add environment variables in Render dashboard:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | your MongoDB Atlas URI |
| `JWT_SECRET` | your secret |
| `GROQ_API_KEY` | your Groq API key |
| `SMTP_USER` | your Gmail |
| `SMTP_PASS` | your Gmail app password |
| `CORS_ORIGIN` | `http://localhost:3000,https://ai-career-path-predicator-tawny.vercel.app` |

---

## Pricing Plans

> ⚠️ Payment integration via **Razorpay** is pending.

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
| AI | Groq API (`llama-3.3-70b-versatile`) |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Gmail SMTP) |
| File Upload | Multer + pdf-parse |
| Icons | Lucide React |
| Validation | Zod |

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

## Tooling & Developer Scripts

Frontend (`frontend-app`):

```bash
npm run compile-ts    # TypeScript type-check (no emit)
npm run lint          # Run ESLint
npm run lint:fix      # Fix lintable issues
```

Backend (`backend-app`):

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix lintable issues
npm run prettier      # Check formatting with Prettier
npm run prettier:fix  # Auto-format files with Prettier
```

## Validation (Zod)

The backend uses `zod` for request validation on key routes (e.g. `routes/auth.js`). Schemas are applied server-side and return structured error messages on validation failure.

## API Documentation (Swagger)

Swagger UI is available once the backend server is running:

- **Dev**: `http://localhost:5000/v1/docs`

## Auth Pattern

- JWT token stored in `localStorage` under key `token`; user object under `user`
- JWT payload uses `userId` and `name` (not `id`)
- `ClientLayout.tsx` guards all authenticated routes — redirects to `/login` if no token found
- Public paths: `/`, `/login`, `/register`, `/contact`, `/upgrade`

---

---

## Team

Built with ❤️ as a college project by:

| Name | Role |
|---|---|
| Achal Kumar | Software Engineer |
| Adarsh Bhagat | Ai Engineer |
| Aastha Jaiswal | Devops Engineer |
| Sachin Kumar | Full Stack Developer |

---
- Swagger UI: `http://localhost:5000/v1/docs`
- Raw OpenAPI JSON: `http://localhost:5000/v1/docs.json`

The OpenAPI spec is generated from JSDoc-style annotations found in `backend-app/routes/*.js`.

If you add new routes, annotate them with `@swagger` blocks to include them in the spec.

## Notes & Troubleshooting

- If `npm install` fails with version errors, the README's recommended tools use conservative versions (Prettier 2.x) known to be available on public registries. Update `package.json` otherwise.
- After changing `package.json`, run `npm install` in each app.
- Restart dev servers after installing or changing environment variables.


© 2025 CareerNav. Crafted to help you land your next role.
