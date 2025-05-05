const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for profile pic upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Create employee
router.post('/', authMiddleware, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, email, phone, employeeType } = req.body;
    const profilePic = req.file ? req.file.filename : null;
    const employee = new Employee({ name, email, phone, employeeType, profilePic });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// List all employees (including deleted if query param showDeleted=true)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const showDeleted = req.query.showDeleted === 'true';
    const filter = showDeleted ? {} : { isDeleted: false };
    const employees = await Employee.find(filter);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employee details by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update employee by id
router.put('/:id', authMiddleware, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, email, phone, employeeType } = req.body;
    const updateData = { name, email, phone, employeeType };
    if (req.file) {
      updateData.profilePic = req.file.filename;
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Soft delete employee by id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted', employee });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search employees by name or email
router.get('/search/:query', authMiddleware, async (req, res) => {
  try {
    const query = req.params.query;
    const employees = await Employee.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      isDeleted: false
    });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
