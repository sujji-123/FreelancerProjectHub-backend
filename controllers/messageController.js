import Message from '../models/Message.js';
import User from '../models/User.js'; // Import the User model

// Get all messages for a project
export const getMessagesByProject = async (req, res) => {
  try {
    const messages = await Message.find({ project: req.params.projectId }).populate('sender', 'name');
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new message
export const createMessage = async (req, res) => {
  const { project, content } = req.body;
  const sender = req.user.id;

  try {
    let message = new Message({
      project,
      sender,
      content,
    });

    await message.save();

    // **THIS IS THE FIX:**
    // After saving, manually populate the 'sender' field
    // so the full user object is returned in the response.
    // This is crucial for the WebSocket emit to have the necessary data.
    message = await Message.findById(message._id).populate('sender', 'name');

    res.status(201).json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};