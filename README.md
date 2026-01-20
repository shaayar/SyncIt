# SyncIt 

A real-time, room-based music synchronization app that allows hosts to control playback while participants join to listen together, request songs, and chat — all synchronized across devices.

## ✨ Features

- 🔐 **Google Authentication** via Firebase Auth
- 🏠 **Room-based architecture** with distinct host and participant roles
- ▶️ **Real-time playback synchronization** using timestamp-based state replication
- 🎶 **Live song request queue** with host moderation system
- 💬 **Real-time chat** functionality within rooms
- 🔄 **Firestore real-time listeners** with custom React hooks
- 🔒 **Role-based security** with Firestore security rules
- 📱 **PWA-ready** architecture for installable experience

## 🚀 How It Works

### Synchronization Technology
Playback is synchronized using **timestamp-based state replication**:

1. When host presses play, a `startedAt` timestamp is stored in Firestore
2. All clients calculate current playback position using:
   ```javascript
   currentTime = (Date.now() - startedAt) / 1000
   ```
3. Late joiners seamlessly sync without audio streaming

### Room Architecture
- **Host**: Controls playback, moderates song requests, manages room
- **Participants**: Listen synchronously, request songs, chat in real-time

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Firebase Firestore (Real-time database)
- **Authentication**: Firebase Google Auth
- **Hosting**: Vercel + Firebase
- **Architecture**: Service-based modular design with custom React hooks

## � Project Structure

```
├── app/
│   ├── page.tsx                 # Landing page
│   └── room/[roomId]/page.tsx   # Dynamic room pages
├── components/
│   ├── MusicPlayer.tsx          # Audio playback controls
│   ├── QueuePanel.tsx           # Song request queue
│   ├── RequestSongForm.tsx      # Song request interface
│   └── ChatBox.tsx              # Real-time chat
├── hooks/
│   ├── useAuth.ts               # Authentication state
│   ├── useRoom.ts               # Room management
│   ├── useQueue.ts              # Queue operations
│   └── useChat.ts               # Chat functionality
├── services/
│   ├── roomService.ts           # Room CRUD operations
│   ├── participantService.ts    # Participant management
│   ├── queueService.ts          # Queue operations
│   └── chatService.ts           # Chat operations
└── lib/
    └── firebase.ts              # Firebase configuration
```

## 🔐 Security

- **Authentication required** for all write operations
- **Role-based access control** - only hosts can control playback and moderate
- **Firestore security rules** enforce server-side authorization
- **No client-side trust assumptions** for critical operations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Firebase project with Google Auth enabled
- Firestore database configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shaayar/SyncIt.git
   cd SyncIt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🎯 Usage

1. **Sign in** with Google Authentication
2. **Create a room** as host or **join existing room** with room ID
3. **Host controls**: Play/pause, approve/deny song requests, manage participants
4. **Participant features**: Request songs, chat, synchronized listening

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Architecture Patterns
- **Service Layer**: Abstracts Firebase operations
- **Custom Hooks**: Encapsulates real-time state logic
- **Component Composition**: Modular, reusable UI components
- **TypeScript**: Full type safety across the application

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Add environment variables
3. Deploy automatically on push to main

### Manual Build
```bash
npm run build
npm run start
```

## 🌟 Future Enhancements

- [ ] YouTube/Spotify API integration
- [ ] Voice chat functionality  
- [ ] User presence indicators
- [ ] Room analytics dashboard
- [ ] Auto-play approved songs
- [ ] Mobile app development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Shubham Dave**
- Portfolio: [Your Portfolio Link]
- GitHub: [@your-username](https://github.com/your-username)

Built as a portfolio project demonstrating real-time web application architecture, Firebase integration, and modern React development patterns.
