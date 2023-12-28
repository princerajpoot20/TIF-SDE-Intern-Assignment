const Community = require('../models/Community');
const User = require('../models/User');
const Role = require('../models/Role');
const Member = require('../models/Member');

exports.addMember = async (req, res) => {
    try {
        const { community, user, role } = req.body;
        const requestorId = req.user._id; // Signed-in user

        // Check if community exists
        const foundCommunity = await Community.findById(community);
        if (!foundCommunity) {
            return res.status(400).json({
                status: false,
                errors: [{ param: "community", message: "Community not found.", code: "RESOURCE_NOT_FOUND" }]
            });
        }

        // Check if user exists
        const foundUser = await User.findById(user);
        if (!foundUser) {
            return res.status(400).json({
                status: false,
                errors: [{ param: "user", message: "User not found.", code: "RESOURCE_NOT_FOUND" }]
            });
        }

        // Check if role exists
        const foundRole = await Role.findById(role);
        if (!foundRole) {
            return res.status(400).json({
                status: false,
                errors: [{ param: "role", message: "Role not found.", code: "RESOURCE_NOT_FOUND" }]
            });
        }

        // Check if requestor is Community Admin
        const adminRole = await Role.findOne({ name: 'Community Admin' });
        if (!adminRole) {
            console.error('Admin role not found in the database');
            return res.status(500).json({ message: 'Internal server error' });
        }

        const isAdmin = await Member.findOne({ community, user: requestorId, role: adminRole._id });
        if (!isAdmin) {
            return res.status(403).json({
                status: false,
                errors: [{ message: "You are not authorized to perform this action.", code: "NOT_ALLOWED_ACCESS" }]
            });
        }

        // Check if user is already a member
        const existingMember = await Member.findOne({ community, user });
        if (existingMember) {
            return res.status(400).json({
                status: false,
                errors: [{ message: "User is already added in the community.", code: "RESOURCE_EXISTS" }]
            });
        }

        // Add member
        const newMember = new Member({ community, user, role });
        await newMember.save();

        res.status(201).json({
            status: true,
            content: {
                data: {
                    id: newMember._id,
                    community: newMember.community,
                    user: newMember.user,
                    role: newMember.role,
                    created_at: newMember.createdAt
                }
            }
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                status: false,
                errors: [{ message: `Invalid ${error.path}`, code: "INVALID_ID" }]
            });
        }
        console.error('Error in addMember:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


exports.removeMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const requestorId = req.user._id; // Signed-in user ID

        // Find the member to be removed
        const memberToRemove = await Member.findById(memberId);
        if (!memberToRemove) {
            return res.status(404).json({
                status: false,
                errors: [{ message: "Member not found.", code: "RESOURCE_NOT_FOUND" }]
            });
        }

        // Check if requestor is Community Admin or Moderator
        const adminRole = await Role.findOne({ name: 'Community Admin' });
        const moderatorRole = await Role.findOne({ name: 'Community Moderator' });

        const isAdminOrModerator = await Member.findOne({
            community: memberToRemove.community,
            user: requestorId,
            role: { $in: [adminRole._id, moderatorRole._id] }
        });

        if (!isAdminOrModerator) {
            return res.status(403).json({
                status: false,
                errors: [{ message: "Not allowed to remove member", code: "NOT_ALLOWED_ACCESS" }]
            });
        }

        // Remove the member
        await memberToRemove.remove();

        res.status(200).json({ status: true });
    } catch (error) {
        console.error('Error in removeMember:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

