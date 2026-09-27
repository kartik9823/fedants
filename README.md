# Feedants Competition Details — Full Stack Assignment

## Overview
A functional full-stack vertical slice implementation of the Feedants Competition Details screen.
Competition data is served dynamically from MongoDB via a Node.js + Express REST API, enforcing all business logic, capacity limits, and duplicate registration rules on the server.

## Tech Stack
- **Frontend**: React Native + Expo + TypeScript + Expo Router
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security & Logging**: Helmet, CORS, Morgan

## Key Features
- **Dynamic Competition Data**: Loaded live via Express API connected to MongoDB.
- **Competition Lifecycle**: Enforces timestamps (`UPCOMING`, `REGISTRATION_OPEN`, `REGISTRATION_CLOSED`, `FULL`, `COMPLETED`, `CANCELLED`).
- **Atomic Concurrency Prevention**: Uses MongoDB `$expr` conditional query with `$inc` inside `findOneAndUpdate` to eliminate race conditions when capacity is reached.
- **Duplicate Registration Guard**: Server-level check and database unique compound index on `{ userId: 1, competitionId: 1 }`.
- **Live Countdown Timer**: Real-time countdown to registration close using custom React hooks with automatic unmount cleanup.
- **Responsive UI States**: Handles 7 visual states (`LOADING`, `AVAILABLE`, `REGISTERED`, `FULL`, `CLOSED`, `COMPLETED`, `ERROR`).

---

## Getting Started

### 1. Backend Setup (Server)
```bash
cd server
npm install
```

Configure `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/feedants
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:8081,exp://192.168.x.x:8081
DEMO_USER_ID=user_001
```

Seed database with sample competition:
```bash
npm run seed
```
*(Copy the printed competition ID from console)*

Start development server:
```bash
npm run dev
```
*(Server starts on http://localhost:5000)*

### 2. Mobile App Setup (React Native)
```bash
cd mobile
npm install
```

Edit `mobile/constants/config.ts`:
- Set `BASE_URL` to your machine's LAN IP address or `http://localhost:5000`.
- Paste the seeded competition ID as `COMPETITION_ID`.

Start Expo app:
```bash
npx expo start
```
Scan the QR code with Expo Go on your mobile device, or press `w` for Web view / `a` for Android Emulator.

---

## API Documentation

### `GET /api/competitions/:id`
Retrieves competition details along with user registration status and computed lifecycle state.

### `POST /api/competitions/:id/register`
Registers the current user for the competition. Performs atomic capacity check and duplicate check.

### `GET /api/health`
Health check endpoint returning server status.

---

## Business Rules & Validation
1. **Time Window**: Registration is only allowed when `registrationStart <= currentTime <= registrationEnd`.
2. **Capacity Limit**: Enforced atomically at database layer (`currentParticipants < maxParticipants`).
3. **No Duplicates**: Enforced via MongoDB unique compound index `{ userId, competitionId }`.
4. **Server Authority**: Frontend is a renderer; backend validates all constraints independently.

---

## Technical Decisions & Trade-offs
- **Expo Router**: Implements clean, file-based routing suitable for production React Native applications.
- **Atomic MongoDB Updates**: Avoids read-modify-write race conditions by executing conditional checks and increments in a single database operation.
- **Mocked Authentication**: Uses static `x-user-id` header to isolate competition state logic from auth infrastructure.
- **Morgan Middleware**: HTTP request logger middleware for Node.js. Formats and prints incoming requests (method, URL, status code, response time) to stdout for easy debugging and monitoring.

---

## What `morgan` Package Does
`morgan` is an HTTP request logging middleware for Node.js and Express:
1. **Automatic Logging**: It logs every incoming HTTP request details (HTTP method, target URL, status code, response body length, response time in ms).
2. **Developer Experience**: In `dev` mode (`app.use(morgan('dev'))`), it outputs color-coded log lines to stdout (terminal) so developers can track API requests and detect server errors in real time.
3. **Production Audit**: Helps maintain an audit trail of incoming requests and monitor latency.
