const Role = require('../models/Role');

exports.createRole = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the role already exists
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ message: 'Role already exists' });
        }

        // Create new role
        const role = new Role({ name });

        // Save role
        await role.save();

        res.status(201).json({
            status: true,
            content: {
                data: {
                    id: role._id,
                    name: role.name,
                    created_at: role.createdAt,
                    updated_at: role.updatedAt
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; // Adjust as needed
        const skip = (page - 1) * limit;

        const total = await Role.countDocuments();
        const roles = await Role.find().skip(skip).limit(limit);

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: Math.ceil(total / limit),
                    page: page
                },
                data: roles.map(role => ({
                    id: role._id,
                    name: role.name,
                    created_at: role.createdAt,
                    updated_at: role.updatedAt
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
