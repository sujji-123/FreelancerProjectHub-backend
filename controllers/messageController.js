import Message from "../models/Message.js";
import { getSocketIO } from "../utils/socket.js";

/**
 * Get all messages for a project
 */
export const getMessagesByProject = async (req, res) => {
  try {
    const messages = await Message.find({ project: req.params.projectId })
      .populate("sender", "name _id")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).send("Server Error");
  }
};

/**
 * Create a new message. Auth required.
 * Body: { project, content }
 */
export const createMessage = async (req, res) => {
  try {
    const { project, content } = req.body;
    if (!project || !content) return res.status(400).json({ error: "project and content required" });

    const sender = req.user.id;
    let message = new Message({ project, content, sender });
    await message.save();

    // populate sender for frontend convenience
    message = await Message.findById(message._id).populate("sender", "name _id");

    // Emit to project room
    try {
      const io = getSocketIO();
      io.to(`project_${project}`).emit("messageCreated", message);
    } catch (e) {
      console.warn("Socket emit skipped (not initialized?)", e.message || e);
    }

    res.status(201).json(message);
  } catch (err) {
    console.error("Create message error:", err);
    res.status(500).send("Server Error");
  }
};
