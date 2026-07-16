# AuroraChat — Backend API

Production-ready Express + MongoDB backend for the AuroraChat AI chatbot application.

## Stack
- **Runtime:** Node.js 18+
- **Framework:** Express
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (bcrypt-hashed passwords)
- **AI:** OpenAI Chat Completions API (text + image/vision)
- **Security:** Helmet, CORS allow-list, rate limiting, input validation

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your real values
npm run dev             # nodemon, local development
npm start                # production
```

## Required environment variables (see `.env.example`)
- `MONGO_URI` — MongoDB Atlas or self-hosted connection string
- `JWT_SECRET` — long random string used to sign tokens
- `OPENAI_API_KEY` — your OpenAI API key
- `CLIENT_URL` — the deployed frontend origin, for CORS

## API overview

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Create an account | Public |
| POST | `/api/auth/login` | Log in, returns JWT | Public |
| GET | `/api/auth/me` | Current user profile | User |
| GET | `/api/chat/conversations` | List a user's conversations | User |
| POST | `/api/chat/conversations` | Start a new conversation | User |
| GET | `/api/chat/conversations/:id` | Get full message history | User |
| DELETE | `/api/chat/conversations/:id` | Delete a conversation | User |
| POST | `/api/chat/conversations/:id/messages` | Send a message (text and/or image) | User |
| GET | `/api/admin/users` | List all users | Admin |
| PATCH | `/api/admin/users/:id` | Update a user's role/status | Admin |
| DELETE | `/api/admin/users/:id` | Remove a user | Admin |
| GET | `/api/admin/analytics` | Dashboard metrics | Admin |

## Making the first admin

New signups default to the `user` role. Promote your own account directly in MongoDB (or write a one-off script):

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } });
```

## Deployment notes
- Any Node-friendly host works: Render, Railway, Fly.io, AWS Elastic Beanstalk, or a container on ECS/Cloud Run.
- Use MongoDB Atlas for a managed, scalable database with automatic backups.
- Put the API behind HTTPS (most platforms handle this automatically) and set `CLIENT_URL` to your real frontend domain to lock down CORS.
- Horizontal scaling: the app is stateless (JWT-based), so you can run multiple instances behind a load balancer without sticky sessions.
- For higher AI throughput, consider queuing long-running requests (e.g., BullMQ + Redis) instead of handling them inline.

## Connecting the frontend
The React app in this project (`AuroraChat.jsx`) is a fully working UI demo that calls an AI model directly for demonstration purposes. To wire it to this backend in a real deployment:
1. Replace the direct AI `fetch` call with calls to `POST /api/chat/conversations/:id/messages`.
2. Store the JWT returned by `/api/auth/login` and attach it as `Authorization: Bearer <token>` on every request.
3. Replace in-memory conversation state with data loaded from `/api/chat/conversations`.
