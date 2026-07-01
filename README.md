# 📘 NoteShare (MERN Stack App)

A full-stack note sharing platform built using MongoDB, Express, React, Node.js, and Cloudinary.
Users can register, login, upload notes with files, view notes, and delete their own notes.
Admin can manage all notes.


## 🚀 Features
👤 User registration & login (JWT auth)
🔐 Admin login system
📤 Upload notes with files (PDF, images, docs)
☁️ Cloudinary file storage
📚 View all notes
🔍 Search notes by title
🗑️ Delete own notes / admin delete all notes
⚡ Secure REST API with authentication

## 🛠️ Tech Stack

### Frontend:

React.js
React Router
Fetch API
Context API

### Backend:

Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
Multer

### Cloud Storage:
Cloudinary

## 📁 Project Structure

project-root/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│
├── frontend/
│   ├── src/
│       ├── pages/
│       ├── context/
│       ├── App.js
│
└── README.md

---

## ⚙️ Setup & Run

### 1. Backend

```bash
cd backend
npm install

# Copy and edit environment variables
cp .env.example .env
# Edit .env: set MONGODB_URL and JWT_SECRET

npm run dev      # or: npm start
# Runs on http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3001
```

The frontend `package.json` has `"proxy": "http://localhost:3000"` so all `/api/...` calls go to the backend automatically.

---

## 🔑 Default Admin Credentials
```
Username: admin
Password: admin123
```
You can change these in `backend/.env`:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

---

## 🌐 Routes

| Page        | URL      | Who can access   |
|-------------|----------|-----------------|
| Login/Register | `/`  | Everyone        |
| Notes Feed  | `/notes` | Logged-in users |
| Admin Panel | `/admin` | Admin only      |

---

## 📡 API Endpoints

| Method | Endpoint              | Auth     | Description        |
|--------|-----------------------|----------|--------------------|
| POST   | /api/auth/register    | None     | Register user      |
| POST   | /api/auth/login       | None     | Login user         |
| POST   | /api/admin/login      | None     | Admin login        |
| GET    | /api/notes            | User JWT | Get all notes      |
| POST   | /api/notes            | User JWT | Upload a note      |
| GET    | /api/admin/notes      | Admin JWT| Get all notes      |
| DELETE | /api/admin/notes/:id  | Admin JWT| Delete a note      |
