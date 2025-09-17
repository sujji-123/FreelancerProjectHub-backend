import Deliverable from "../models/Deliverable.js";

export const uploadDeliverable = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // FIX: Get project and description from the request body
    const { project, description } = req.body;
    // FIX: Get the authenticated user's ID from req.user
    const uploadedBy = req.user.id;

    const newDeliverable = await Deliverable.create({
      project,
      description,
      uploadedBy,
      fileUrl: req.file.path, // FIX: Use 'fileUrl' to match the model and get path from multer
    });

    res.status(201).json(newDeliverable);
  } catch (err) {
    console.error("Upload Deliverable Error:", err);
    res.status(500).json({ error: "Server error while uploading deliverable." });
  }
};

export const getDeliverablesByProject = async (req, res) => {
  try {
    const deliverables = await Deliverable.find({ project: req.params.projectId }).populate('uploadedBy', 'name');
    res.json(deliverables);
  } catch (err) {
    console.error("Get Deliverables Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(deliverable);
  } catch (err) {
    console.error("Update Deliverable Error:", err);
    res.status(500).json({ error: err.message });
  }
};