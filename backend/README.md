# TalkFile Backend

## Setup
1. Copy `.env.example` to `.env` and fill values:
```
OPENAI_API_KEY=your_openai_key_here
MONGO_URI=mongodb://127.0.0.1:27017/talkfile
JWT_SECRET=supersecretjwt
PORT=5000
```
2. Install & run:
```
npm install
npm run dev
```
## Endpoints
- `POST /api/auth/register` { name, username, email, password }
- `POST /api/auth/login` { username, password } → { token }
- `POST /api/auth/forgot` { email } → returns `token` (for demo)
- `POST /api/auth/reset` { token, newPassword }

- `GET /api/files` (auth)
- `POST /api/files/upload` (auth, multipart field `file`)
- `GET /api/files/:id` (auth)

- `POST /api/ai/summarize/:fileId` (auth)
- `GET /api/ai/summary/:fileId` (auth)
- `POST /api/ai/flashcards/:fileId` (auth)
- `GET /api/ai/flashcards/:fileId` (auth)
- `POST /api/ai/quiz/:fileId` (auth)
- `GET /api/ai/quiz/:fileId` (auth)

- `GET /api/schedule` (auth)
- `POST /api/schedule` (auth)
- `PATCH /api/schedule/:id` (auth)
- `DELETE /api/schedule/:id` (auth)