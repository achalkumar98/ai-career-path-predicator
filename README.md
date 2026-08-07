# AI Career Navigator

AI Career Navigator is a full-stack career-assistance platform for exploring career paths, analyzing resumes, finding jobs, and getting AI-powered guidance. It combines a Next.js frontend with an Express, MongoDB, and Groq-backed API.

- Live frontend: [ai-career-path-predicator-tawny.vercel.app](https://ai-career-path-predicator-tawny.vercel.app)
- Live backend: [ai-career-path-predicator.onrender.com](https://ai-career-path-predicator.onrender.com)

## Features

- Secure user registration, login, password reset, and profile management with JWT authentication.
- Career assessment using skills and interests, with AI-generated career recommendations.
- AI career chat for resumes, interviews, learning, job search, and career-growth questions.
- Resume PDF upload and analysis: extracts text, supported skills, and year values from the document.
- Personality and career insights generated from a user's written input.
- LinkedIn job search by keyword and location using Puppeteer.
- Learning-resource recommendations based on skills and interests.
- Assessment and insight history for signed-in users.
- Contact and feedback forms delivered through Gmail SMTP.
- Swagger API documentation.
- Joi validation on every API endpoint that accepts request data, including resume uploads.

## Tech Stack

| Area              | Technology                                                                 |
| ----------------- | -------------------------------------------------------------------------- |
| Frontend          | Next.js 15, React 19, TypeScript, Tailwind CSS                             |
| Backend           | Node.js, Express 5                                                         |
| Database          | MongoDB with Mongoose                                                      |
| AI                | Groq API using `llama-3.3-70b-versatile` through the OpenAI-compatible SDK |
| Authentication    | JWT and bcryptjs                                                           |
| Validation        | Joi                                                                        |
| File upload       | Multer and pdf-parse                                                       |
| Email             | Nodemailer with Gmail SMTP                                                 |
| Job search        | Puppeteer and LinkedIn public job listings                                 |
| API documentation | Swagger UI                                                                 |

## Project Structure

```text
ai-career-nav/
├── frontend-app/             # Next.js client
├── backend-app/              # Express API
│   ├── src/controllers/      # HTTP request handlers
│   ├── src/services/         # Business logic and integrations
│   ├── src/models/           # MongoDB models
│   ├── src/routes/v1/        # API routes
│   ├── src/validations/      # Joi schemas, one file per API area
│   └── src/middleware/       # Auth and Joi validation middleware
└── render.yaml               # Render deployment configuration
```

## Prerequisites

- Node.js 20+
- npm
- MongoDB (local instance or MongoDB Atlas)
- A Groq API key
- Gmail SMTP credentials if contact and feedback emails are enabled

## Run Locally

### 1. Clone and install dependencies

```bash
git clone <your-repository-url>
cd ai-career-nav

cd backend-app
npm install

cd ../frontend-app
npm install
```

`backend-app` runs `npm run install:chrome` after installation. This downloads the Chrome binary required by the job-matching endpoint.

### 2. Configure environment variables

Create `backend-app/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ai-career-nav
JWT_SECRET=replace-with-a-long-random-secret
GROQ_API_KEY=your-groq-api-key
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-gmail-app-password
CORS_ORIGIN=http://localhost:3000
```

Create `frontend-app/.env.local`:

```env
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/v1/
```

> `GROQ_API_KEY` is the required AI key. The project uses the OpenAI SDK only because Groq provides an OpenAI-compatible API;

### 3. Start the applications

```bash
# Terminal 1
cd backend-app
npm run dev

# Terminal 2
cd frontend-app
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/v1/docs`

## API Overview

The development API prefix is `/v1`. When `NODE_ENV=production`, the prefix changes to `/api`.

| Method | Endpoint                | Authentication | Request validation                                        |
| ------ | ----------------------- | -------------- | --------------------------------------------------------- |
| POST   | `/auth/register`        | No             | `name`, `email`, `password`                               |
| POST   | `/auth/login`           | No             | `email`, `password`                                       |
| POST   | `/auth/forgot-password` | No             | `email`                                                   |
| POST   | `/auth/reset-password`  | No             | `token`, `password`                                       |
| GET    | `/auth/profile`         | JWT            | —                                                         |
| PUT    | `/auth/profile`         | JWT            | At least one profile field                                |
| POST   | `/assessment`           | JWT            | `skills`, `interests` string arrays                       |
| GET    | `/assessment/history`   | JWT            | —                                                         |
| POST   | `/chat`                 | JWT            | `message`                                                 |
| POST   | `/resume/upload`        | JWT            | PDF file named `resume`, maximum 10 MB                    |
| POST   | `/insights`             | JWT            | `input`                                                   |
| POST   | `/resources`            | No             | `skills`, `interests` string arrays                       |
| POST   | `/job-matching`         | No             | `keyword`, `location`                                     |
| POST   | `/contact`              | No             | `name`, `email`, `subject`, `message`                     |
| POST   | `/feedback`             | No             | `rating`, `category`, `message`; optional `name`, `email` |

All request-data endpoints use Joi schemas from `backend-app/src/validations`. Invalid data returns HTTP `400` with a structured `errors` array before it reaches the controller.

### Authentication

Login and registration return a JWT. Send it on protected routes as:

```http
Authorization: Bearer <token>
```

The frontend stores the token under `token` and the user data under `user` in local storage.

### Example: career assessment

```http
POST /v1/assessment
Authorization: Bearer <token>
Content-Type: application/json

{
  "skills": ["JavaScript", "React"],
  "interests": ["Web Development", "AI"]
}
```

## Validation Architecture

Each API area has its own Joi schema file:

```text
backend-app/src/validations/
├── auth.validation.js
├── assessment.validation.js
├── chat.validation.js
├── contact.validation.js
├── feedback.validation.js
├── insights.validation.js
├── jobMatching.validation.js
├── resources.validation.js
└── resume.validation.js
```

Routes apply schemas through the shared `validate` middleware. It validates request `body`, `query`, `params`, and uploaded `file` data.

## Job Matching and Puppeteer

Job matching launches a headless Chrome browser to read LinkedIn public job listings. The Chrome binary is installed with:

```bash
cd backend-app
npm run install:chrome
```

If the endpoint reports `Could not find Chrome`, reinstall the browser binary:

```bash
npm run install:chrome
```

If a cache folder exists but the executable is missing, delete only the incomplete folder inside `backend-app/.cache/puppeteer/chrome/`, then run the command again.

LinkedIn can rate-limit, change page markup, or block automated browsing. Those failures are separate from Chrome-installation errors and can still cause the endpoint to return HTTP `500`.

## Deployment

### Vercel frontend

1. Import the repository into Vercel.
2. Set the root directory to `frontend-app`.
3. Add this environment variable:

| Key                        | Value                                                 |
| -------------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_BASE_API_URL` | `https://ai-career-path-predicator.onrender.com/api/` |

### Render backend

`render.yaml` is configured with `backend-app` as its root directory and installs Chrome during the build.

1. Create a Render Web Service from the repository.
2. Set the root directory to `backend-app` if not using the included Blueprint.
3. Use the build command `npm install && npm run install:chrome`.
4. Use the start command `npm start`.
5. Add the backend environment variables listed above, with production values.

For a Chrome-missing deployment error, use **Manual Deploy → Clear build cache & deploy** in Render. Confirm the build log contains a line similar to:

```text
chrome@<version> <path-to-chrome-executable>
```

## Scripts

### Backend

```bash
npm start                 # Start the API
npm run dev               # Start with nodemon
npm run install:chrome    # Install Puppeteer's Chrome binary
npm run lint              # Run ESLint
npm run lint:fix          # Apply ESLint fixes
npm run prettier          # Check Prettier formatting
npm run prettier:fix      # Format supported files
```

### Frontend

```bash
npm run dev         # Start the Next.js development server
npm run build       # Create a production build
npm start           # Start the production server
npm run compile-ts  # Type-check without emitting files
npm run lint        # Run ESLint
npm run lint:fix    # Apply ESLint fixes
```

## Troubleshooting

| Problem                            | What to check                                                               |
| ---------------------------------- | --------------------------------------------------------------------------- |
| API cannot connect to MongoDB      | Verify `MONGO_URI` and MongoDB network access.                              |
| AI endpoints fail                  | Verify `GROQ_API_KEY`; no `OPENAI_API_KEY` is needed.                       |
| Contact or feedback email fails    | Configure `SMTP_USER` and a Gmail App Password in `SMTP_PASS`.              |
| Browser missing for job matching   | Run `npm run install:chrome`; on Render clear the build cache and redeploy. |
| Frontend CORS error                | Add the deployed frontend URL to `CORS_ORIGIN`, separated by commas.        |
| API route returns validation error | Review the endpoint's Joi requirements in the API Overview table.           |

## Team

| Name           | Role                 |
| -------------- | -------------------- |
| Achal Kumar    | Software Engineer    |
| Adarsh Bhagat  | AI Engineer          |
| Aastha Jaiswal | DevOps Engineer      |
| Sachin Kumar   | Full Stack Developer |

© 2026 CareerNav.
