# 🚀 Leave Workflow API

A RESTful API for managing employee leave requests with role-based access control. Employees can submit leave requests, while managers can review, approve, or reject them through a structured workflow.
Deployed version is hosted on Azure as an App Service and is accessible on:
`https://leaveworkflowapi-agc0gfehcjdehrhf.southcentralus-01.azurewebsites.net/api-docs`

---

## 📦 Table of Contents
- Project Overview
- Features
- Tech Stack
- Prerequisites
- Running the Application (Docker - Recommended)
- Running the Application (Manual Setup)
- Environment Variables
- Database Setup
- API Documentation
- Running Tests
- Future Enhancements
- AI Assistance
- Summary

---

## 📌 Project Overview

The Leave Workflow API simplifies employee leave management within an organization by providing a structured approval workflow.

### User Roles
- Applicant – Creates and tracks leave requests
- Reviewer – Reviews, approves, or rejects leave requests

### Workflow States
SUBMITTED → UNDER REVIEW → APPROVED / REJECTED -> RETURNED

---

## ⚙️ Tech Stack
- Node.js (Express)
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcrypt
- Swagger (OpenAPI)
- Jest + Supertest
- Docker

---

## 🧰 Prerequisites
Make sure you have installed:
- Node.js (v18+)
- npm
- Docker & Docker Compose (recommended)
- PostgreSQL (only if running without Docker)

---

## 🐳 Running the Application (Recommended - Docker)

This is the easiest way to run the project.

1. Clone the repository
   git clone https://github.com/IamKundaSakala/leave_workflow_api.git
   cd leave_workflow_api

2. Start the application with Docker
   docker compose up --build

This will start:
- PostgreSQL database
- API server

3. Access the application
   API: http://localhost:3003
   Swagger Docs: http://localhost:3003/api-docs

---

## 💻 Running the Application (Manual Setup)

Use this if you are NOT using Docker.

1. Clone the repository
   git clone https://github.com/IamKundaSakala/leave_workflow_api.git
   cd leave_workflow_api

2. Install dependencies
   npm install

3. Setup environment variables
   Create a .env file in the root directory:

   JWT_SECRET=your_jwt_secret
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=leave_workflowDB
   DB_HOST=127.0.0.1
   DB_PORT=5432

4. Run database migrations
   npx sequelize-cli db:migrate

5. Start the application
   npm start

6. Access the application
   http://localhost:3003

---

## 🗄️ Database Setup

The application uses PostgreSQL with Sequelize ORM.

To initialize the schema:
   npx sequelize-cli db:migrate

To reset database (optional):
   npx sequelize-cli db:migrate:undo:all
   npx sequelize-cli db:migrate

---

## 📚 API Documentation

Swagger documentation is available at:
   http://localhost:3003/api-docs

You can:
- View all endpoints
- Test APIs directly
- Inspect request/response formats

---

## 🧪 Running Tests

Run the automated test suite:
   npm test

Test coverage includes:
- Authentication
- Role-based access control
- Leave request creation
- Workflow transitions
- API validation rules

---

## 🔐 Environment Variables

JWT_SECRET   Secret key for JWT authentication
DB_USERNAME  PostgreSQL username
DB_PASSWORD  PostgreSQL password
DB_DATABASE  Database name
DB_HOST      Database host
DB_PORT      Database port

---

## 🚀 Future Enhancements
- Email notifications (approval/rejection)
- Audit logging
- Leave balance tracking
- Admin dashboard
- Multi-organization support
- File attachments for leave requests
- CI/CD pipeline improvements
- Frontend UI (React / Next.js integration)

---

## 🤖 AI Assistance

This project was built using a combination of:

✔ Manual Development
- System architecture
- Database design
- Business logic
- Authentication and authorization

✔ AI Assistance
- Boilerplate code generation
- Swagger documentation support
- Test scaffolding (Jest/Supertest)
- Debugging assistance
- README and documentation improvements

---

## ✅ Summary (How to run in one line)

Docker (Recommended)
   docker compose up --build

Manual
   npm install
   npx sequelize-cli db:migrate
   npm start
