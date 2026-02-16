require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDb = require('./src/config/db');
const studentRoutes = require('./src/routes/students');
const attendanceRoutes = require('./src/routes/attendance');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDb();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

