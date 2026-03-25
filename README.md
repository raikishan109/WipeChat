# 🚀 WipeChat Application

A real-time, privacy-focused chat application built with Next.js, Express, Socket.io, and MongoDB.

## 📁 Clean Project Structure

```
WipeChat/
├── frontend/          # Next.js frontend application
├── backend/           # Express + Socket.io backend server
├── README.md          # This file
├── DEPLOYMENT.md      # Deployment guide
├── PROJECT_STRUCTURE.md  # Detailed structure docs
```

**That's it! Clean and simple.** ✨

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally

### 1. Start Backend

```bash
cd backend
npm install
npm run dev
```
✅ Backend: **http://localhost:3001**

### 2. Start Frontend (New Terminal)

```bash
cd frontend
npm install
npm run dev
```
✅ Frontend: **http://localhost:3000**

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Backend (`backend/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/privatechat
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

⚠️ **Never commit `.env` files!** Use `.env.example` as templates.

---

## ✨ Features

- ✅ Real-time messaging
- ✅ User authentication
- ✅ File sharing
- ✅ 24-hour chat expiry
- ✅ Typing indicators
- ✅ Responsive design

---

## 🌐 Deployment (Free)

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Vercel | Free |
| Backend | Render | Free |
| Database | MongoDB Atlas | Free |

**📖 Read [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide**

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14
- React 18
- Socket.io Client
- Axios

**Backend:**
- Express
- Socket.io
- MongoDB + Mongoose
- CORS

---

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed structure
- **[frontend/README.md](./frontend/README.md)** - Frontend docs
- **[backend/README.md](./backend/README.md)** - Backend docs

---

## 🐛 Troubleshooting

**Backend won't start?**
- Ensure MongoDB is running: `net start MongoDB`
- Check `.env` file exists in `backend/`

**Frontend can't connect?**
- Ensure backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env`

**CORS errors?**
- Update `CORS_ORIGIN` in `backend/.env`

---

## 📄 License

MIT

---

**Built with ❤️ for privacy-focused real-time communication**
