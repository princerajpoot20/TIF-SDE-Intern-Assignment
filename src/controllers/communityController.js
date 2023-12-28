const Community = require('../models/Community');
const User = require('../models/User');
const Role = require('../models/Role');
const Member = require('../models/Member');

// Utility function to generate slug from name
const generateSlug = (name) => {
    return name.toLowerCase().split(' ').join('-');
};

exports.createCommunity = async (req, res) => {
    try {
        const { name } = req.body;
        const slug = generateSlug(name);

        // Check if the community already exists
        const existingCommunity = await Community.findOne({ slug });
        if (existingCommunity) {
            return res.status(400).json({ message: 'Community with this slug already exists' });
        }

        // The owner is the signed-in user from the authenticate middleware
        const owner = req.user._id;
        // Create new community
        const community = new Community({ name, slug, owner });
        // Save community
        await community.save();

        const adminRole = await Role.findOne({ name: 'Community Admin' });
        // Create a new Member with the owner as "Community Admin"
        const member = new Member({
            community: community._id,
            user: owner,
            role: adminRole._id
        });

        await member.save();

        res.status(201).json({
            status: true,
            content: {
                data: {
                    id: community._id,
                    name: community.name,
                    slug: community.slug,
                    owner: community.owner,
                    created_at: community.createdAt,
                    updated_at: community.updatedAt
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllCommunities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; // Number of documents per page
        const skip = (page - 1) * limit;

        const total = await Community.countDocuments();
        const communities = await Community.find().skip(skip).limit(limit);

        // Populate owner details
        const populatedCommunities = await Promise.all(communities.map(async (community) => {
            const owner = await User.findById(community.owner).select('_id name');
            return {
                id: community._id,
                name: community.name,
                slug: community.slug,
                owner: owner,
                created_at: community.createdAt,
                updated_at: community.updatedAt
            };
        }));

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: Math.ceil(total / limit),
                    page: page
                },
                data: populatedCommunities
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getMyOwnedCommunities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; // You can adjust this as needed
        const skip = (page - 1) * limit;

        const owner = req.user._id; // ID of the currently signed-in user

        const total = await Community.countDocuments({ owner });
        const communities = await Community.find({ owner }).skip(skip).limit(limit);

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: Math.ceil(total / limit),
                    page: page
                },
                data: communities.map(community => ({
                    id: community._id,
                    name: community.name,
                    slug: community.slug,
                    owner: community.owner,
                    created_at: community.createdAt,
                    updated_at: community.updatedAt
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllMembers = async (req, res) => {
    try {
        const communitySlug = req.params.slug;
        const page = parseInt(req.query.page) || 1;
        const limit = 10; // 10 documents per page
        const skip = (page - 1) * limit;

        // Find community by slug
        const community = await Community.findOne({ slug: communitySlug });
        if (!community) {
            return res.status(404).json({
                status: false,
                errors: [{ message: "Community not found.", code: "RESOURCE_NOT_FOUND" }]
            });
        }

        // Get total number of members in the community
        const total = await Member.countDocuments({ community: community._id });

        // Fetch members with user and role details
        const members = await Member.find({ community: community._id })
            .skip(skip)
            .limit(limit)
            .populate('user', 'id name')
            .populate('role', 'id name');

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: Math.ceil(total / limit),
                    page: page
                },
                data: members.map(member => ({
                    id: member._id,
                    community: member.community,
                    user: { id: member.user._id, name: member.user.name },
                    role: { id: member.role._id, name: member.role.name },
                    created_at: member.createdAt
                }))
            }
        });
    } catch (error) {
        console.error('Error in getAllMembers:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
