const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Employee.findOne({ email });
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/register
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, department } = req.body;
        
        const existing = await Employee.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Employee.create({ firstName, lastName, email, password: hashedPassword, role, department });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};