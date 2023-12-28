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




// need to reimplement the below funtion

// exports.getAllMembers = async (req, res) => {
//     try {
//         const { communityId } = req.params;
        
//         // Fetch members
//         const members = await Member.find({ community: communityId }).populate('user', 'name');

//         res.status(200).json({
//             message: 'Members fetched successfully',
//             data: members
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// Implement other member-related methods as needed
