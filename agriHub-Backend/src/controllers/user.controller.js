const mongoose = require('mongoose');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function createUser(req, res) {
    // res.send('User registration endpoint');
  try {
    const { fullName, username, email, password, role } = req.body;

    const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
        return res.status(400).json({ message: 'Email or username already exists' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        fullName,
        username,
        email,
        password: hashPassword,
        role: role || 'farmer'
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });

    res.status(201).json({
        message: "User registered successfully", user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            username: user.username,
            role: user.role
        }
    });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
        res.status(200).json({
            message: "Login successful", user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

function logoutUser(req, res) {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({ message: "Logout successful" });
}



module.exports = { createUser, loginUser, logoutUser };