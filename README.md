# Primetrade Backend Assignment

## Overview

This project includes a scalable REST API backend built with Node.js, Express, and Prisma, connected to a Neon PostgreSQL database. It also features a basic React frontend to interact with the API. The system supports JWT authentication and role based access control for administrators and standard users.

## Prerequisites

* Node.js installed
* PostgreSQL database connection string (Neon or local)

## Backend Setup

1. Navigate to the backend directory
   cd backend
2. Install dependencies
   npm install
3. Configure your database by editing the .env file with your valid connection string.
4. Push the schema to your database
   npx prisma db push
5. Generate the Prisma client
   npx prisma generate
6. Start the server
   node index.js

The server runs on port 5000 by default. API documentation is available at http://localhost:5000/api/docs

## Frontend Setup

1. Navigate to the frontend directory
   cd frontend
2. Install dependencies
   npm install
3. Start the development server
   npm run dev

The frontend will run on the default Vite port (usually 5173). Ensure the backend is running simultaneously for the full experience.

## Features

* User authentication with secure password hashing
* Role based access control (admin and user roles)
* CRUD operations for products
* Secure JWT handling and validation
* API documentation via Swagger

## Scalability Note

The current architecture uses a monolithic approach with Express and Prisma which is suitable for initial development. To scale this application for production traffic, several strategies can be employed

* Microservices Architecture: Break down the application into smaller services like an Auth Service and a Product Service to scale them independently based on load.
* Caching: Implement Redis to cache frequently accessed data, such as product lists, to reduce database query load and improve response times.
* Load Balancing: Deploy the backend behind a load balancer (like Nginx or AWS ALB) to distribute incoming traffic across multiple instances of the Node application.
* Database Optimization: Utilize database connection pooling, read replicas for heavy read operations, and indexing on frequently queried columns.
* Containerization: Dockerize the application and use orchestration tools like Kubernetes for automated deployment, scaling, and management.
