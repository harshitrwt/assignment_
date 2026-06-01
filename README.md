# Primetrade - TaskVoid App

This project is a scalable REST API backend and a matching React frontend for a Task Management application (TaskVoid), built as part of the Primetrade assignment. It features JWT-based authentication, role-based access control (Admin vs. User), and full CRUD functionality with a modern, high-contrast "Hyper-Saturated Fluid" design aesthetic.

## Live Application Links

The application is deployed and accessible live.

- Frontend Application (Vercel): https://assignment-inky-theta.vercel.app
- Backend API Base URL (Render): https://assignment-tlhw.onrender.com
- Interactive API Documentation (Swagger): https://assignment-tlhw.onrender.com/api/docs

## Features

### Backend (Node.js, Express, Prisma, PostgreSQL)
- Authentication: Secure user registration and login with bcryptjs for password hashing and jsonwebtoken for secure session management.
- Role-Based Access Control (RBAC):
  - User: Can create tasks, view their own tasks, update task status (Pending -> In Progress -> Completed), and delete their own tasks.
  - Admin: Automatically seeded (Username: admin, Password: adminpassword). Admins can view ALL users' tasks, create tasks, edit any task's status, and delete ANY task.
- CRUD Operations: Full RESTful operations on the Task entity.
- API Versioning: All endpoints are strictly versioned under the /api/v1/ prefix.
- Validation & Error Handling: Centralized error handling middleware and input validation ensuring empty or malicious payloads are rejected gracefully.
- Swagger Documentation: Auto-generated interactive API documentation available at /api/docs.

### Frontend (React, Vite, Vanilla CSS)
- Hyper-Saturated Fluid Design: A visually striking UI with glassmorphism, heavy typography, and high contrast.
- Split Layout Auth Pages: Full-screen layout with floating glass cards for Login and Register.
- Dashboard: Distinct views depending on the role. Standard users see their tasks; Admins see a "System Overview" of all tasks.
- Responsive & Fast: Built with Vite for optimized builds and fast load times.

## How to Use the Application

1. Open the Frontend URL in your browser.
2. Register a new user by clicking "Need an account? Register" on the login page, or log in with the pre-seeded admin credentials:
   - Username: admin
   - Password: adminpassword
3. Once logged in, you will be redirected to the Dashboard.
4. As a regular user, use the top panel to Create Tasks. Edit or delete your tasks from the cards below.
5. As an admin, you will see two sections: "Admin Tasks" (tasks you created) and "User Tasks" (tasks created by all other registered users in the system). You can toggle the status of any task by clicking the NEXT / REOPEN buttons.

## Local Setup & Execution

### 1. Database Setup
The backend requires a PostgreSQL database. We recommend creating a free database cluster on Neon (neon.tech) and acquiring the connection string.

### 2. Backend Setup
Open a terminal and run the following commands to start the backend:

```bash
cd backend
npm install

# Push the Prisma schema to your PostgreSQL database
npx prisma db push

# Generate the Prisma client
npx prisma generate

# Start the Node.js server (runs on port 5000 by default)
npm run start
```
Note: Ensure you create a `.env` file in the `backend/` directory containing your `DATABASE_URL`, a `JWT_SECRET`, and an optional `CORS_ORIGIN` (set to `*` for easy local development).
Access Swagger API Docs Locally: http://localhost:5000/api/docs

### 3. Frontend Setup
Open a second terminal window and run the following commands to start the frontend:

```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```
Note: Ensure you create a `.env` file in the `frontend/` directory containing `VITE_API_URL=http://localhost:5000` to connect to your local backend.
Access the Frontend Locally: http://localhost:5173

## Scalability & Security Architecture

To scale this application for production-level traffic, the following architectural upgrades would be implemented:
1. Microservices: Split the Authentication logic and the Task Management logic into separate decoupled services communicating via gRPC or message queues (RabbitMQ).
2. Caching: Implement Redis to cache user sessions and frequently accessed task lists to drastically reduce the load on the PostgreSQL database.
3. Load Balancing: Deploy multiple instances of the Node.js backend behind an AWS Application Load Balancer (ALB) or Nginx reverse proxy to distribute incoming requests.
4. Containerization: Containerize both the frontend and backend using Docker and deploy them via Kubernetes (K8s) for automatic horizontal scaling and self-healing.
5. Rate Limiting: Implement express-rate-limit to prevent brute force and DDoS attacks on the login and registration endpoints.
