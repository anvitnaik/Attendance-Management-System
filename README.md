# Attendance Management System

Simple attendance management system built with **Node.js**, **Express**, and **MongoDB**.

It lets you:

- Manage a list of students (name, roll number, email)
- Mark daily attendance (present/absent) for each student
- View and edit attendance for any date

## Requirements

- Node.js 18+ and npm
- MongoDB running locally or a MongoDB connection string

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create a `.env` file at the project root based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Adjust `MONGODB_URI` if your MongoDB is not on `mongodb://127.0.0.1:27017/attendance_db`.

3. **Run the server**

   ```bash
   # development with auto-reload
   npx nodemon server.js

   # or plain start
   npm start
   ```

4. **Open the app**

   Visit `http://localhost:5000` in your browser.

## API Overview

- **Students**

  - `GET /api/students` — list all students
  - `POST /api/students` — create student

    ```json
    {
      "name": "Alice",
      "rollNumber": "R001",
      "email": "alice@example.com"
    }
    ```

  - `DELETE /api/students/:id` — delete a student

- **Attendance**

  - `GET /api/attendance?date=YYYY-MM-DD` — get attendance for a date (returns all students with their status)
  - `POST /api/attendance` — save attendance for a date

    ```json
    {
      "date": "2026-02-16",
      "records": [
        { "studentId": "<mongodb-id>", "status": "present" },
        { "studentId": "<mongodb-id>", "status": "absent" }
      ]
    }
    ```

The web UI in `public/index.html` uses these APIs internally.

