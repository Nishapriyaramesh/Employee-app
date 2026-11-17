const Employee = require('../models/Employee');
const cache = {};
const bcrypt = require('bcryptjs'); 
const mongoose = require('mongoose'); 

// POST /api/employees
exports.createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, department } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEmployee = await Employee.create({
            firstName, lastName, email, 
            password: hashedPassword, 
            role, department
        });

        cache['employees'] = null; 
        res.status(201).json({ message: 'Employee created', newEmployee });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/employees
exports.getEmployees = async (req, res) => {
    try {
        if (cache['employees']) {
            console.log('Returning from Cache');
            return res.json(cache['employees']);
        }

        const employees = await Employee.find()
            .select('-password')
            .populate('department', 'name'); 
            
        cache['employees'] = employees;
        console.log('Returning from MongoDB');
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/employees/stats
exports.getStats = async (req, res) => {
    try {
        const stats = await Employee.aggregate([
        
            { $addFields: { departmentId: { $toObjectId: "$department" } } },
            { $group: { _id: '$departmentId', totalEmployees: { $sum: 1 } } },
            { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
            { $project: { departmentName: { $arrayElemAt: ['$dept.name', 0] }, totalEmployees: 1, _id: 0 } }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE /api/employees/:id (PATCH)
exports.updateEmployee = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can update employees' });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        ).select('-password'); 

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        cache['employees'] = null; 

        res.status(200).json({ 
            message: 'Employee updated successfully', 
            updatedEmployee 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete' });
        }

        await Employee.findByIdAndDelete(req.params.id);
        cache['employees'] = null; 
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};