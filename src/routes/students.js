const express = require('express');
const Student = require('../models/Student');

const router = express.Router();

// GET /api/students - list all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: 1 });
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

// POST /api/students - create a new student
router.post('/', async (req, res) => {
  try {
    const { name, rollNumber, email } = req.body;
    if (!name || !rollNumber) {
      return res
        .status(400)
        .json({ message: 'Name and roll number are required' });
    }

    const existing = await Student.findOne({ rollNumber });
    if (existing) {
      return res.status(409).json({ message: 'Roll number already exists' });
    }

    const student = await Student.create({ name, rollNumber, email });
    res.status(201).json(student);
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ message: 'Failed to create student' });
  }
});

// DELETE /api/students/:id - delete a student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ message: 'Failed to delete student' });
  }
});

module.exports = router;

