const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { checkAuth } = require('../middleware/authMiddleware');

// GET routes
router.get('/', employeeController.getEmployees);
router.get('/stats', employeeController.getStats);

// POST route
router.post('/', employeeController.createEmployee);

// UPDATE route 
router.patch('/:id', checkAuth, employeeController.updateEmployee);

// DELETE route
router.delete('/:id', checkAuth, employeeController.deleteEmployee);

module.exports = router;