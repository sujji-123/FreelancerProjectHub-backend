import Message from "../models/Message.js";

export const createMessage = async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessagesByProject = async (req, res) => {
  try {
    const msgs = await Message.find({ project_id: req.params.projectId }).populate("sender_id", "name");
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
