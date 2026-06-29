# 📘 NoteShare — Full Stack Project

A notes sharing system with user auth, file uploads, and an admin panel.

## Tech Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer, bcrypt
- **Frontend:** React 18, React Router v6, Fetch API

---

## 📁 Project Structure

```
noteshare-full/
├── backend/               ← Express + MongoDB API
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/           ← auto-created on first upload
│   ├── .env.example
│   └── server.js
│
└── frontend/              ← React SPA
    ├── public/
    └── src/
        ├── context/AuthContext.jsx
        ├── pages/
        │   ├── AuthPage.jsx
        │   ├── NotesPage.jsx
        │   └── AdminPage.jsx
        ├── App.jsx
        └── index.css
```

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
