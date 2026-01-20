# 🚀 **PORTFOLIO PROJECT GUIDE — SyncIt (Next.js PWA)**

I’ve structured this as:

* **What you build**
* **How you build it**

So you don’t just “build an app” — you build a *credible engineering project.*

---

# 🎯 **1. Your Project Goal (Write this in your README later)**

You can literally copy/paste this later:

> **Project Goal:**
> Build a real-time, room-based media synchronization PWA where a host controls playback and participants join to listen together, request songs, and interact via chat — focusing on scalable architecture, real-time sync, and modern web technologies.

This sounds professional and serious.

---

# 🧱 **2. Tech Stack (Stick to this — don’t overcomplicate)**

Use this exact stack:

| Layer     | Your Choice                             | Why it’s good for portfolio |
| --------- | --------------------------------------- | --------------------------- |
| Frontend  | **Next.js 14 (App Router)**             | Modern + industry standard  |
| Styling   | **Tailwind CSS**                        | Clean UI, fast dev          |
| Backend   | **Firebase (Firestore or Realtime DB)** | No server needed            |
| Real-time | **Firebase listeners / WebSockets**     | Real-time systems           |
| Auth      | **Firebase Auth (Google sign-in)**      | Real user system            |
| PWA       | **next-pwa + Service Worker**           | Installable app             |
| Hosting   | **Vercel + Firebase**                   | Professional deployment     |

---

# 🗂 **3. Recommended Folder Structure (Clean & Professional)**

Your Next.js project should look like this:

```
/app
  /page.tsx          → Landing page
  /room/[id]/page.tsx → Room screen
/components
  Navbar.tsx
  MusicPlayer.tsx
  QueuePanel.tsx
  ChatBox.tsx
/lib
  firebase.ts
  sync.ts
/services
  roomService.ts
  queueService.ts
/public
  manifest.json
  icons/
```

This looks **very pro** in your GitHub repo.

---

# 🛠 **4. What You Build — Step by Step (MVP Roadmap)**

## ✅ **PHASE 1 — Core App (2–3 weeks)**

### Feature 1 — Landing Page

Build a clean page with:

* App name: **SyncParty**
* Button: **Create Room (Host)**
* Input: **Join Room (User)**

Learning points:

* Next.js routing
* UI design
* State management

---

### Feature 2 — Room System

When Host clicks **Create Room**:

* Generate a random room ID
* Save to Firebase like:

```
rooms/
  room123/
    host: "userID"
    isPlaying: false
    currentSong: null
    queue: []
    users: []
```

Learning points:

* Firebase structure
* Real-time database modeling

---

### Feature 3 — Join Room

Users enter room code →
They get added to:

```
rooms/room123/users/
  userXYZ: true
```

They can now:

* See current song
* See queue

Learning:

* Real-time listeners
* Dynamic routing in Next.js

---

### Feature 4 — Basic Music Sync

Host controls:

* Play
* Pause

When host presses Play:
You update Firebase:

```
isPlaying = true
```

Every user listens to this change and plays music locally.

Learning:

* Event-driven programming
* Sync logic

---

### Feature 5 — Song Request Queue

User can:

* Type a song name
* Click “Request”

It goes to:

```
rooms/room123/queue/
  request1:
     song: "Blinding Lights"
     user: "Rahul"
```

Host sees requests and can approve.

Learning:

* CRUD operations
* Queues
* UX design

---

## ✅ **PHASE 2 — Make It Portfolio-Worthy (Next 2 weeks)**

Add these to look *serious*:

### Feature 6 — Real Chat

Simple text chat inside room:

* Firebase messages collection
* Show username + message

Learning:

* Real-time chat
* Firestore queries

---

### Feature 7 — PWA Features

Add:

* manifest.json
* offline caching
* “Install App” option

Now you can say:

> “Built a fully installable Progressive Web App.”

---

### Feature 8 — Google Login

Instead of random users:

* Use Firebase Google Auth
* Show profile picture in chat

Looks very professional.

---

# 📚 **5. What You Will Learn (Great for Resume)**

After this project, you can confidently claim:

You learned:

* Next.js 14 App Router
* Firebase Realtime DB / Firestore
* Real-time Web Apps
* PWA development
* Service workers
* State sync across devices
* Scalable architecture
* Authentication systems

This is **VERY strong for jobs.**

---

# 💼 **6. How to Present This in Your Portfolio**

### **GitHub README (You can use this later)**

Example:

```
# SyncParty 🎧

SyncParty is a real-time PWA that allows a host to control music playback while participants join a shared room to listen together, request songs, and chat in real time.

## Tech Stack
- Next.js 14 (App Router)
- Firebase (Realtime DB + Auth)
- Tailwind CSS
- PWA + Service Worker
- Vercel Deployment

## Features
- Room-based architecture
- Real-time playback sync
- Live song request queue
- In-app chat
- Google authentication
- Installable PWA
```

---

# 🚀 **7. Deployment Checklist**

When you finish:

* Host on **Vercel**
* Connect Firebase
* Add custom domain (optional)
* Put screenshots in README

---

# 🎯 **8. If You Want, I Can Help You Build It Faster**

I can now help you with any of these (pick one and I’ll do it next):

1. Create **Next.js starter template** for you
2. Design **Firebase database schema** in detail
3. Write **actual sample code** for room creation
4. Make **UI wireframes** for Host vs User
5. Help you write your **final GitHub README**

---

# Firebase Data Model

Below is a **practical, production-style Firebase schema** tailored for *SyncParty* PWA. You can use this directly in the project.

---

# 🔥 **FIREBASE DATA MODEL FOR SYNC PARTY**

You can implement this using **Firestore (recommended)** — I’ll write it in Firestore-style structure, but it works conceptually the same in Realtime DB too.

---

## **1) Top-Level Collections**

You will have **four main collections:**

```
rooms/
users/
messages/
requests/
```

Let’s go one by one.

---

## **2) ROOMS COLLECTION (Core of your app)**

Path:

```
rooms/{roomId}
```

### Example document: `rooms/abc123`

```json
{
  "roomId": "abc123",
  "hostId": "user_1",
  "hostName": "Shubham",
  "createdAt": "2026-01-19T10:00:00Z",
  "isActive": true,
  "isPlaying": false,
  "currentTrack": {
    "type": "music",          // "music" or "youtube"
    "title": "Blinding Lights",
    "artist": "The Weeknd",
    "youtubeId": null,
    "startedAt": 1674123456789,   // timestamp when host pressed play
    "lastSyncedAt": 1674123456789
  },
  "participantsCount": 5,
  "maxParticipants": 50,
  "mode": "music",           // default mode
  "settings": {
    "allowRequests": true,
    "allowChat": true,
    "allowVoice": false
  }
}
```

### Why this structure is good:

* You can **listen to this document in real time**
* Whenever `isPlaying` changes, everyone syncs
* You can later add:

  * Premium rooms
  * Private rooms
  * Password protection

---

## **3) ROOM PARTICIPANTS (Who is inside the room)**

Sub-collection under each room:

```
rooms/{roomId}/participants/{userId}
```

Example: `rooms/abc123/participants/user_2`

```json
{
  "userId": "user_2",
  "name": "Rahul",
  "joinedAt": "2026-01-19T10:05:00Z",
  "role": "user",        // or "host"
  "isMuted": false,
  "isOnline": true,
  "lastActive": 1674123456789
}
```

This helps you:

* Show who is in the room
* Show online status
* Count active users
* Kick users later if needed

---

## **4) QUEUE COLLECTION (Song requests list)**

Path:

```
rooms/{roomId}/queue/{requestId}
```

Example: `rooms/abc123/queue/req_1`

```json
{
  "requestId": "req_1",
  "requestedBy": "user_2",
  "requestedByName": "Rahul",
  "track": {
    "type": "music",
    "title": "Levitating",
    "artist": "Dua Lipa",
    "youtubeId": null
  },
  "status": "pending",   // pending | approved | rejected | played
  "requestedAt": "2026-01-19T10:06:00Z",
  "approvedAt": null,
  "playedAt": null,
  "position": 2
}
```

This lets the host:

* Approve/reject songs
* See who requested what
* Show an ordered queue

---

## **5) CHAT MESSAGES (Room chat)**

Path:

```
rooms/{roomId}/messages/{messageId}
```

Example: `rooms/abc123/messages/msg_1`

```json
{
  "messageId": "msg_1",
  "senderId": "user_2",
  "senderName": "Rahul",
  "text": "Play my song next 🔥",
  "sentAt": "2026-01-19T10:07:00Z",
  "type": "text"   // you can add voice later
}
```

You will:

* Listen to this collection in real-time
* Show messages in order of `sentAt`

---

## **6) USERS COLLECTION (For login later)**

Path:

```
users/{userId}
```

Example: `users/user_1`

```json
{
  "userId": "user_1",
  "name": "Shubham Dave",
  "email": "shubham@gmail.com",
  "photoURL": "https://...",
  "createdAt": "2026-01-01T09:00:00Z",
  "lastSeen": 1674123456789
}
```

Later you can:

* Track how many rooms a user created
* Track most requested songs
* Build leaderboard, etc.

---

## **7) REAL-TIME SYNC FLOW (How everything works together)**

Here’s how your app will actually behave:

### ✅ When Host presses Play:

You update:

```
rooms/abc123/currentTrack.startedAt = now
rooms/abc123/isPlaying = true
```

All users:

* Are listening to this document
* See `isPlaying = true`
* Start playback from `startedAt` timestamp

---

### ✅ When a user requests a song:

You create:

```
rooms/abc123/queue/req_2
```

Host gets notification and sees it in UI.

---

### ✅ When host approves a song:

You update:

```
status = "approved"
approvedAt = now
```

---

### ✅ When it starts playing:

You move it to currentTrack and mark:

```
status = "played"
playedAt = now
```

---

## **8) MINIMAL VERSION YOU SHOULD IMPLEMENT FIRST**

To keep things simple for your MVP, you can start with only:

* rooms/{roomId}
* rooms/{roomId}/participants
* rooms/{roomId}/queue

You can add chat later.

---

## **9) Firestore rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ---------- USERS ----------
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }

    // ---------- ROOMS ----------
    match /rooms/{roomId} {

      // Anyone logged in can read room info
      allow read: if request.auth != null;

      // Only authenticated user can create a room
      allow create: if request.auth != null;

      // Only the HOST can update core room state
      allow update: if isHost(roomId);

      // No one can delete rooms (for safety)
      allow delete: if false;

      // ---------- PARTICIPANTS SUBCOLLECTION ----------
      match /participants/{userId} {

        // Anyone logged in can read participants
        allow read: if request.auth != null;

        // A user can add themselves as participant
        allow create: if request.auth != null 
          && request.auth.uid == userId;

        // Only the user themselves or the host can update
        allow update: if request.auth != null &&
          (request.auth.uid == userId || isHost(roomId));

        allow delete: if false;
      }

      // ---------- QUEUE (SONG REQUESTS) ----------
      match /queue/{requestId} {

        // Anyone in the room can read queue
        allow read: if request.auth != null;

        // Any logged-in user can create a request
        allow create: if request.auth != null;

        // Only requester or host can update
        allow update: if request.auth != null &&
          (request.auth.uid == resource.data.requestedBy || isHost(roomId));

        allow delete: if false;
      }

      // ---------- CHAT MESSAGES ----------
      match /messages/{messageId} {

        allow read: if request.auth != null;

        allow create: if request.auth != null;

        // Only sender or host can edit message
        allow update: if request.auth != null &&
          (request.auth.uid == resource.data.senderId || isHost(roomId));

        allow delete: if false;
      }
    }

    // ---------- HELPER FUNCTION ----------
    function isHost(roomId) {
      return request.auth != null &&
        get(/databases/$(database)/documents/rooms/$(roomId)).data.hostId 
          == request.auth.uid;
    }
  }
}
```

---

## **10. Actual Folder Structure**

### 🏗 **PART 1 — RECOMMENDED PROJECT STRUCTURE (Next.js 14 + App Router)**

After you run `npx create-next-app@latest syncparty`, organize your project like this:

```
syncparty/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 // Landing page
│   ├── room/
│   │   └── [roomId]/
│   │       └── page.tsx         // Main room screen
│   └── api/
│       └── notifications/
│           └── route.ts         // (later) for web push
│
├── components/
│   ├── Navbar.tsx
│   ├── CreateRoomButton.tsx
│   ├── JoinRoomForm.tsx
│   ├── MusicPlayer.tsx          // Host controls
│   ├── NowPlaying.tsx
│   ├── QueuePanel.tsx
│   ├── RequestSongForm.tsx
│   └── ChatBox.tsx
│
├── lib/
│   ├── firebase.ts              // Firebase init
│   ├── firestore.ts             // Firestore helpers
│   └── sync.ts                  // playback sync logic
│
├── services/
│   ├── roomService.ts
│   ├── participantService.ts
│   └── queueService.ts
│
├── hooks/
│   ├── useRoom.ts
│   ├── useQueue.ts
│   └── useChat.ts
│
├── public/
│   ├── manifest.json
│   └── icons/
│
├── styles/
│   └── globals.css
│
└── next.config.js
```

---

# 🧠 **How to think about each layer**

## **1️⃣ `app/` — Pages (what the user sees)**

### `/app/page.tsx` → Landing Page

This will contain:

* “Create Room” button
* “Join Room” input
* App branding

It will use:

```ts
<CreateRoomButton />
<JoinRoomForm />
```

---

### `/app/room/[roomId]/page.tsx` → Room Page

This is your **main app screen** where everything happens:

Inside this page you will render:

```tsx
<Navbar />
<NowPlaying />
<MusicPlayer />   // Only visible if user is host
<QueuePanel />
<RequestSongForm />
<ChatBox />
```

This page will use your custom hook:

```ts
const { room, isHost } = useRoom(roomId);
```

---

## **2️⃣ `components/` — Reusable UI pieces**

Each component has a clear responsibility:

| Component        | What it does                         |
| ---------------- | ------------------------------------ |
| Navbar           | Shows room ID, copy link, leave room |
| CreateRoomButton | Creates room in Firestore            |
| JoinRoomForm     | Takes room code + joins              |
| NowPlaying       | Shows current song                   |
| MusicPlayer      | Host controls play/pause             |
| QueuePanel       | Shows song requests                  |
| RequestSongForm  | Users request songs                  |
| ChatBox          | Live chat                            |

This makes your project look **very professional**.

---

## **3️⃣ `lib/firebase.ts` — Firebase setup**

Inside `lib/firebase.ts` you will initialize Firebase like this:

```ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

## **4️⃣ `services/` — All Firestore logic lives here**

### `roomService.ts`

Functions like:

```ts
createRoom()
getRoom(roomId)
updatePlayback(roomId, data)
```

### `participantService.ts`

Functions like:

```ts
joinRoom(roomId, user)
leaveRoom(roomId, userId)
```

### `queueService.ts`

Functions like:

```ts
addRequest(roomId, request)
approveRequest(roomId, requestId)
```

This separation is **great for your portfolio.**

---

## **5️⃣ `hooks/` — Real-time listeners**

### `useRoom.ts`

Listens to Firestore room document in real-time.

### `useQueue.ts`

Listens to song requests.

### `useChat.ts`

Listens to messages.

Example idea:

```ts
const room = useRoom(roomId);
```

Super clean pattern.

---

# 🚀 **PART 2 — How you should build this (step-by-step)**

### **STEP 1 — Set up project**

Run:

```bash
npx create-next-app@latest syncparty
cd syncparty
npm install firebase tailwindcss
```

Enable Tailwind when asked.

---

### **STEP 2 — Add Firebase**

* Create Firebase project
* Add Web App in Firebase
* Copy config into `.env.local`

Example:

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
```

---

### **STEP 3 — Build landing page**

In `app/page.tsx`:

* Add Create Room button
* Add Join Room input

---

### **STEP 4 — Implement room creation**

In `roomService.ts`, write a function that creates a Firestore document like:

```
rooms/{roomId}
```

---

### **STEP 5 — Build Room Page UI**

In `/app/room/[roomId]/page.tsx` render:

* NowPlaying
* Queue
* Chat
* MusicPlayer (if host)

---

### **STEP 6 — Add Firestore listeners**

Use `onSnapshot()` in your hooks to listen in real-time.

---

### **STEP 7 — Add PWA later**

Once basic app works, add:

* `manifest.json`
* Service worker

---

# 🎯 **PART 3 — What this gives you (for your portfolio)**

You will be able to say:

> “Built a real-time PWA using Next.js 14 and Firebase with room-based architecture, Firestore real-time listeners, role-based access control, and modular service-based design.”

That’s *seriously impressive*.

---


