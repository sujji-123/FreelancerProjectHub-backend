// backend/controllers/projectController.js
import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const project = new Project({
      client: req.user.id,
      title,
      description,
      budget,
      status: "open",
    });
    await project.save();

    await project.populate("client", "name email");
    res.status(201).json(project);
  } catch (err) {
    console.error("createProject:", err);
    res.status(500).send("Server Error");
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'open' })
      .populate("client", "name email")
      .populate("assignedFreelancer", "_id name");
    res.json(projects);
  } catch (err) {
    console.error("getProjects:", err);
    res.status(500).send("Server Error");
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.id }).populate(
      "client",
      "name email"
    );
    res.json(projects);
  } catch (err) {
    console.error("getMyProjects:", err);
    res.status(500).send("Server Error");
  }
};

export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const updates = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (String(project.client) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Forbidden: not your project" });
    }

    const allowed = ["title", "description", "budget", "status", "assignedFreelancer"];
    allowed.forEach((k) => {
      if (updates[k] !== undefined) project[k] = updates[k];
    });

    await project.save();
    const populated = await Project.findById(projectId).populate("client", "name email");
    res.json(populated);
  } catch (err) {
    console.error("updateProject:", err);
    res.status(500).send("Server Error");
  }
};

export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (String(project.client) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Forbidden: not your project" });
    }

    await Project.findByIdAndDelete(projectId);
    res.json({ msg: "Project deleted" });
  } catch (err) {
    console.error("deleteProject:", err);
    res.status(500).send("Server Error");
  }
};