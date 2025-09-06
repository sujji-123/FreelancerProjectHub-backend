import Deliverable from "../models/Deliverable.js";

export const uploadDeliverable = async (req, res) => {
  try {
    const { project_id, description, uploaded_by } = req.body;
    const deliverable = await Deliverable.create({
      project_id,
      description,
      uploaded_by,
      file_url: `/uploads/${req.file.filename}`,
    });
    res.json(deliverable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDeliverablesByProject = async (req, res) => {
  try {
    const deliverables = await Deliverable.find({ project_id: req.params.projectId });
    res.json(deliverables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(deliverable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
