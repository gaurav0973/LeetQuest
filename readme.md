# LeetQuest

LeetQuest is a full-stack web application designed to help users practice coding problems, track their submissions, and create playlists of problems. It provides a platform for users to hone their problem-solving skills, with an integrated code editor and execution environment.

## Features

- **User Authentication**: Secure user registration and login.
- **Problem Solving**: View and solve a wide range of coding problems.
- **Code Editor**: An in-browser code editor with syntax highlighting.
- **Code Execution**: Run your code against test cases and see the results.
- **Submission History**: Track all your submissions for each problem.
- **Playlists**: Create and manage playlists of your favorite problems.
- **Admin Panel**: Admins can add and manage coding problems.

## Tech Stack

**Backend:**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Code Execution**: Judge0 API

**Frontend:**

- **Library**: React.js
- **Framework**: Vite
- **Styling**: Tailwind CSS & DaisyUI
- **State Management**: Zustand
- **Routing**: React Router
- **Form Management**: React Hook Form
- **Code Editor**: Monaco Editor

## Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── generated/
│   │   ├── libs/
│   │   ├── middleware/
│   │   └── routes/
│   ├── package.json
│   └── ...
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── layout/
    │   ├── lib/
    │   ├── page/
    │   └── store/
    ├── package.json
    └── ...
```

### Backend Structure

- `prisma/`: Contains the database schema and migration files.
- `src/controllers/`: Handles the business logic for each route.
- `src/generated/`: Contains the auto-generated Prisma client.
- `src/libs/`: Includes shared libraries and helper functions (e.g., database connection, Judge0 library).
- `src/middleware/`: Express middleware for tasks like authentication.
- `src/routes/`: Defines the API endpoints.

### Frontend Structure

- `src/components/`: Reusable React components.
- `src/layout/`: Main layout components for the application.
- `src/lib/`: Helper functions and libraries (e.g., Axios instance, language configurations).
- `src/page/`: Top-level page components for each route.
- `src/store/`: Zustand stores for global state management.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- A running PostgreSQL instance

### Backend Setup

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add the following:

    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    JWT_SECRET="your_jwt_secret"
    JUDGE0_API_URL="https://judge0-ce.p.rapidapi.com"
    JUDGE0_API_KEY="your_judge0_api_key"
    ```

4.  **Apply database migrations:**

    ```bash
    npx prisma migrate dev
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The backend will be running on `http://localhost:3000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173`.

## API Endpoints

A brief overview of the available API endpoints:

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Log in a user.
- `GET /api/problems`: Get a list of all problems.
- `GET /api/problems/:id`: Get a single problem by ID.
- `POST /api/problems`: Add a new problem (Admin only).
- `POST /api/execute`: Execute code.
- `POST /api/submissions`: Create a new submission.
- `GET /api/submissions/user/:userId`: Get all submissions for a user.
- `GET /api/playlists`: Get all playlists for the logged-in user.
- `POST /api/playlists`: Create a new playlist.
- `POST /api/playlists/add`: Add a problem to a playlist.

---

Happy Coding!
