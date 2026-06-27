# Leave Workflow API

A RESTful API for managing employee leave requests with role-based access control. Applicants can submit leave requests, while Reviewers can review, approve, reject, or return submissions for modification.

---

# Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Future Enhancements](#future-enhancements)
- [AI Assistance](#ai-assistance)

---

# Project Overview

The Leave Workflow API is designed to simplify the leave approval process within an organization.

The system supports two user roles:

- **Applicant** – Creates and manages leave requests.
- **Reviewer** – Reviews submitted leave requests and updates their status.

The API implements:

- JWT Authentication
- Role-Based Access Control (RBAC)
- Leave request workflow management
- Swagger API documentation
- Automated testing with Jest and Supertest

---

# Features

## Authentication

- User registration
- User login
- JWT token generation
- Password hashing using bcrypt

## Role-Based Access Control

### Applicant

- Register and log in
- Create leave requests
- View submitted leave requests

### Reviewer

- Log in
- View all submissions
- Review submissions
- Approve submissions
- Reject submissions
- Return submissions with comments

## Submission Workflow

Supported workflow:

```
Submitted
   ↓
UnderReview
   ↓
Approved
Rejected
Returned
```

The API validates:

- Required fields
- Leave category
- Leave dates
- Workflow status transitions

---

# Getting Started

## Prerequisites

Before running the project, ensure you have:

- Node.js (v18 or later)
- PostgreSQL
- npm

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/IamKundaSakala/leave_workflow_api.git

cd leave_workflow_api
```

### 2. Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root and configure the following values:
JWT_SECRET=your_jwt_secret

Update below values in the config/config.json file
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=leave_workflowDB
DB_HOST=127.0.0.1


```

---

# Database Setup

Run the database migrations:

```bash
npx sequelize-cli db:migrate
```

<!-- If you have seeders:

```bash
npx sequelize-cli db:seed:all
``` -->

---

# Running the Application

Start the server:

```bash
npm start
```

The API will be available at:

```
http://localhost:3003
```

---

# API Documentation

Swagger documentation is available at:

```
http://localhost:3003/api-docs
```

Swagger allows you to:

- View all available endpoints
- Inspect request and response schemas
- Test API endpoints directly from the browser

---

# Running Tests

Run the automated test suite:

```bash
npm run test
```

The tests cover:

- User registration
- User login
- Role validation
- JWT authentication
- Submission creation
- Authorization rules
- Submission workflow

---

# Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcrypt
- Swagger (OpenAPI)
- Jest
- Supertest

---

# Future Enhancements

Potential improvements include:

- Email notifications
- In-app notifications
- Audit logging
- Leave balance management
- Administrator role
- Management by company(reviewer and applicant setups under orgs/depts)
- Dashboard and reporting
- File attachment support
- CI/CD pipeline
- Docker support
- Frontend application (React or Angular)

---

# AI Assistance

This project was developed using a combination of original implementation and AI-assisted development.

## Original Work

The following components were designed and implemented independently:

- Express application architecture
- Database design using Sequelize
- PostgreSQL configuration
- Authentication flow
- JWT authorization
- Business logic for leave submissions
- Reviewer workflow implementation
- Role-based authorization

## AI-Assisted Contributions

GitHub Copilot was used to assist with:

- Initial Swagger documentation
- Boilerplate route generation
- Sample API test cases
- Jest and Supertest test scaffolding
- Debugging common Express and Sequelize issues
- Improving documentation

AI assistance accelerated development while architectural decisions, business logic, and system design remained my own.

---
