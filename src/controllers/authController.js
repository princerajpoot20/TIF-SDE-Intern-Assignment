const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authUtils = require('../utils/authUtils');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await authUtils.hashPassword(password);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save user
        await user.save();

        // Create JWT token
        const token = authUtils.generateToken(user._id);

        res.status(201).json({
            status: true,
            content: {
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    created_at: user.createdAt
                },
                meta: {
                    access_token: token
                }
            }
        });
    } catch (error) {
        console.error('Error in signup/signin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User does not exist' });
        }

        // Check password
        const isMatch = await authUtils.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = authUtils.generateToken(user._id);

        res.status(200).json({
            status: true,
            content: {
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    created_at: user.createdAt
                },
                meta: {
                    access_token: token
                }
            }
        });
    } catch (error) {
        console.error('Error in signup/signin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        // User is added to req in the authMiddleware
        const user = req.user;

        res.json({
            status: true,
            content: {
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    created_at: user.createdAt
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};