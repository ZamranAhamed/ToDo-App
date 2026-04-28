# ⚙️ TODO App Backend

## 📝 Overview

This is the backend of the MERN TODO application built using Node.js, Express, and MongoDB.

It provides a RESTful API for managing tasks, including creating, updating, deleting, and toggling completion status.

---

## ✨ Features

- Create, Read, Update, Delete (CRUD) todos
- Toggle task completion status
- Input validation using Mongoose schema
- Error handling with proper HTTP status codes
- RESTful API design

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- dotenv
- cors

---

## ⚙️ Setup Instructions

### 1. Navigate to backend directory

```bash
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables
Create a .env file in the root of the server folder:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

## 🍃 MongoDB Connection Notes

### Option 1: MongoDB Atlas (Recommended)
Go to MongoDB Atlas
Create a cluster
Create a database user
Add IP address:
Use 0.0.0.0/0 for development
Copy connection string

Example:

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todoDB
```

### Option 2: Local MongoDB
If MongoDB is installed locally:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/todoDB
```

### ▶️ Run the Server
```bash
npm run dev
```

Server will run on:
```bash
http://localhost:5000
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | /api/todos | Get all todos |
| POST   | /api/todos | Create a new todo |
| PUT    | /api/todos/:id | Update a todo |
| PATCH  | /api/todos/:id/done | Toggle completion status |
| DELETE | /api/todos/:id | Delete a todo |

---

## ⚠️ Assumptions

- MongoDB is accessible (Atlas or local)
- Correct environment variables are configured
- Client will consume API via HTTP

---

## 🚧 Limitations

- No authentication (single-user system)
- No pagination or rate limiting
- No role-based access control

---

## 🚀 Future Improvements

- Add authentication (JWT-based)
- Add pagination and performance optimization
- Implement rate limiting and security enhancements
- Add logging and monitoring

