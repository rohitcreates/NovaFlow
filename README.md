# NovaFlow

A focused workspace for managing projects, tasks, documentation, and collaboration without the clutter.

[Live Demo](https://nova-flow-8omm.vercel.app/)

## Overview

NovaFlow is a full-stack workspace and project management application built to bring projects, tasks, documentation, and team collaboration into one place.

It includes authentication, workspace management, member permissions, projects, task management, documentation, comments, attachments, and invitations.

## Features

### Authentication

- User registration and login
- JWT-based authentication
- Forgot password
- Password reset
- Change password
- Profile management
- Profile avatar upload

### Workspaces

- Create and manage workspaces
- Edit and archive workspaces
- Workspace cover images
- Workspace members
- Member roles and permissions
- Workspace invitations
- Accept and decline invitations

### Projects

- Create and manage projects
- Edit and archive projects
- Project cover images
- Project documentation
- Project comments

### Task Management

- Create and manage tasks
- Edit and archive tasks
- Assign tasks to workspace members
- Task descriptions
- Task notes
- Task comments
- Task attachments

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose

### Authentication & Services

- JWT
- bcrypt
- Multer
- Resend
- dotenv

## Project Structure

```text
NovaFlow/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── utils/
│
└── frontend/
    └── src/
        ├── app/
        ├── components/
        ├── context/
        ├── lib/
        ├── services/
        └── types/


Getting Started
Prerequisites

Make sure you have:

Node.js installed
MongoDB database
npm
Clone the repository
git clone https://github.com/rohitcreates/NovaFlow.git
cd NovaFlow
Backend
cd backend
npm install

Create a .env file with the environment variables required by the backend.

Then start the server:

npm run dev
Frontend

Open another terminal:

cd frontend
npm install
npm run dev

The development server will then be available at:

http://localhost:3000
Environment Variables

NovaFlow uses environment variables for configuration and sensitive credentials.

Create the required .env files locally before running the application.

Do not commit environment files or sensitive credentials to the repository.



Future Improvements
Additional collaboration features
Further UI and UX improvements
Additional project management capabilities