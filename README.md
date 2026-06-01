# Primetrade - TaskVoid App

This project is a complete, scalable REST API backend and a matching React frontend for a Task Management application (TaskVoid), built as part of the Primetrade assignment. It features JWT-based authentication, role-based access control (Admin vs. User), and full CRUD functionality with a stunning "Hyper-Saturated Fluid" aesthetic on the frontend.

## 🚀 Features

### Backend (Node.js, Express, Prisma, PostgreSQL)
- **Authentication:** Secure user registration and login with `bcryptjs` for password hashing and `jsonwebtoken` for secure session management.
- **Role-Based Access Control (RBAC):**
  - **User:** Can create tasks, view their own tasks, update task status (Pending -> In Progress -> Completed), and delete their own tasks.
  - **Admin:** Automatically seeded (`admin` / `adminpassword`). Admins can view ALL users' tasks, create tasks, edit any task's status, and delete ANY task.
- **CRUD Operations:** Full RESTful operations on the `Task` entity.
- **API Versioning:** All endpoints are versioned under `/api/v1/`.
- **Validation & Error Handling:** Centralized error handling middleware and input validation ensuring empty or malicious payloads are rejected gracefully.
- **Swagger Documentation:** Auto-generated interactive API documentation available at `/api/docs`.

### Frontend (React, Vite, Vanilla CSS)
- **Hyper-Saturated Fluid Design:** A visually striking UI with glassmorphism, heavy typography, and high contrast.
- **Split Layout Auth Pages:** Full-screen yellow layout with floating glass cards for Login and Register.
- **Dashboard:** Distinct views depending on the role. Standard users see their tasks; Admins see a "System Overview" of all tasks.
- **Status Colors:** Visual indicators for task progress (Red = Pending, Orange = In Progress, Green = Completed).
- **Responsive & Fast:** Built with Vite for blazing-fast HMR and optimized builds.

---

## 💻 Local Setup & Execution

### 1. Database Setup
We use **Neon PostgreSQL**. You can use the provided connection string or create your own.

### 2. Backend Setup
Open a terminal and run the following commands:
```bash
cd backend
npm install

# Push the schema to your database
npx prisma db push

# Generate the Prisma client
npx prisma generate

# Start the server (runs on port 5000)
npm run start
```
*Note: Make sure your `backend/.env` contains your `DATABASE_URL` and `JWT_SECRET`.*

**Access Swagger API Docs Locally:** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

### 3. Frontend Setup
Open a second terminal window and run:
```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```
**Access the Frontend Locally:** [http://localhost:5173](http://localhost:5173)

---

## 🌍 Free Deployment Guide (Render)

If you want to host this online for free, **Render (render.com)** is the perfect choice for both the Node.js Backend and the React Frontend.

### Deploying the Backend on Render (Web Service)
1. Push your code to a GitHub repository.
2. Go to Render Dashboard -> **New** -> **Web Service**.
3. Connect your GitHub repository.
4. **Settings:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `node index.js`
5. **Environment Variables:**
   - Add `DATABASE_URL` (your Neon connection string).
   - Add `JWT_SECRET` (e.g., `my-super-secret-key-123`).
   - Add `CORS_ORIGIN` (set this to your frontend URL once deployed, or `*` for testing).
6. Click **Deploy**. Once live, you will get a URL like `https://taskvoid-api.onrender.com`.
7. *You can access your live Swagger Docs at `https://taskvoid-api.onrender.com/api/docs`.*

### Deploying the Frontend on Render (Static Site)
1. Go to Render Dashboard -> **New** -> **Static Site**.
2. Connect the same GitHub repository.
3. **Settings:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
4. **Environment Variables:**
   - Note: You must update the Axios base URLs in your frontend code (e.g., `Login.jsx`, `Dashboard.jsx`) to point to your live Render backend URL instead of `http://localhost:5000`, OR use a `.env` file in the frontend with `VITE_API_URL`.
5. Click **Deploy**.

---

## 🏗 Scalability & Security Architecture

If this application were to scale to thousands of users, the following architectural upgrades would be implemented:
1. **Microservices:** Split the Auth logic and the Task logic into separate decoupled services communicating via gRPC or message queues (RabbitMQ/Kafka).
2. **Caching:** Implement **Redis** to cache user sessions and frequently accessed task lists to take the load off the PostgreSQL database.
3. **Load Balancing:** Deploy multiple instances of the Node.js backend behind an AWS Application Load Balancer or Nginx reverse proxy.
4. **Dockerization:** Containerize both the frontend and backend using Docker and deploy them via Kubernetes (K8s) for automatic scaling and self-healing.
5. **Rate Limiting:** Implement `express-rate-limit` to prevent brute force attacks on the login and registration endpoints.
