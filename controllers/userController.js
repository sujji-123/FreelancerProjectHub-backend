// backend/controllers/userController.js
import User from '../models/User.js';
import Project from '../models/Project.js'; // Import Project model
import bcrypt from 'bcryptjs';

// ... (getProfile, updateProfile, changePassword, etc., remain the same)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect current password' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const updateNotificationPreferences = async (req, res) => {
    const { enabled } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { emailNotificationsEnabled: !!enabled },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// --- NEW FUNCTION ADDED ---
// Get users a client or freelancer has collaborated with
export const getCollaboratedUsers = async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'client') {
            projects = await Project.find({ client: req.user.id, assignedFreelancer: { $exists: true } }).populate('assignedFreelancer', 'name email profilePicture');
            const freelancers = projects.map(p => p.assignedFreelancer).filter(Boolean);
            // Return unique freelancers
            const uniqueFreelancers = freelancers.filter((freelancer, index, self) =>
                index === self.findIndex((f) => f._id.toString() === freelancer._id.toString())
            );
            return res.json(uniqueFreelancers);
        } else { // 'freelancer'
            projects = await Project.find({ assignedFreelancer: req.user.id }).populate('client', 'name email profilePicture');
            const clients = projects.map(p => p.client).filter(Boolean);
            // Return unique clients
            const uniqueClients = clients.filter((client, index, self) =>
                index === self.findIndex((c) => c._id.toString() === client._id.toString())
            );
            return res.json(uniqueClients);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// ... (uploadProfilePicture, getAllClients, etc., remain the same)
export const uploadProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (req.file) {
            user.profilePicture = req.file.path.replace(/\\/g, "/");
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

export const getAllClients = async (req, res) => {
    try {
        const clients = await User.find({ role: 'client' }).select('-password');
        res.json(clients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getAllFreelancers = async (req, res) => {
    try {
        const freelancers = await User.find({ role: 'freelancer' }).select('-password');
        res.json(freelancers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};