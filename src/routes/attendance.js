const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const router = express.Router();

// Helper to normalise date to YYYY-MM-DD
function toDateString(input) {
  const date = input ? new Date(input) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// GET /api/attendance/all - Returns all attendance records
router.get('/all', async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('student', 'name rollNumber')
      .sort({ date: -1, 'student.rollNumber': 1 })
      .lean();

    const result = records.map((r) => ({
      _id: r._id,
      studentId: r.student._id,
      name: r.student.name,
      rollNumber: r.student.rollNumber,
      date: r.date,
      status: r.status,
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching all attendance:', err);
    res.status(500).json({ message: 'Failed to fetch attendance records' });
  }
});

// PUT /api/attendance/:id - Update specific attendance record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await Attendance.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('student', 'name rollNumber');

    if (!updated) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating attendance:', err);
    res.status(500).json({ message: 'Failed to update attendance' });
  }
});

// GET /api/attendance?date=YYYY-MM-DD
router.get('/', async (req, res) => {
  try {
    const dateStr = toDateString(req.query.date);

    const students = await Student.find().sort({ createdAt: 1 });
    const attendance = await Attendance.find({ date: dateStr }).lean();

    const map = new Map();
    attendance.forEach((rec) => {
      map.set(String(rec.student), rec.status);
    });

    const result = students.map((s) => ({
      studentId: s._id,
      name: s.name,
      rollNumber: s.rollNumber,
      status: map.get(String(s._id)) || 'absent',
    }));

    res.json({ date: dateStr, records: result });
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
});

// POST /api/attendance
// Body: { date: 'YYYY-MM-DD', records: [{ studentId, status }] }
router.post('/', async (req, res) => {
  try {
    const { date, records } = req.body;
    const dateStr = toDateString(date);

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'No attendance records provided' });
    }

    const ops = records.map((r) =>
      Attendance.findOneAndUpdate(
        { student: r.studentId, date: dateStr },
        { status: r.status },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    );

    await Promise.all(ops);
    res.json({ message: 'Attendance saved', date: dateStr });
  } catch (err) {
    console.error('Error saving attendance:', err);
    res.status(500).json({ message: 'Failed to save attendance' });
  }
});

module.exports = router;

