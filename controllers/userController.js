// backend/controllers/userController.js
import User from '../models/User.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  const { name, bio, skills } = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    if (skills) {
      user.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
    }


    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (req.file) {
            user.profilePicture = req.file.path.replace(/\\/g, "/"); // Ensure forward slashes for URL
            await user.save();
            res.json(user);
        } else {
            res.status(400).json({ msg: 'No file uploaded' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all clients
export const getAllClients = async (req, res) => {
    try {
        const clients = await User.find({ role: 'client' }).select('-password');
        res.json(clients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all freelancers
export const getAllFreelancers = async (req, res) => {
    try {
        const freelancers = await User.find({ role: 'freelancer' }).select('-password');
        res.json(freelancers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};