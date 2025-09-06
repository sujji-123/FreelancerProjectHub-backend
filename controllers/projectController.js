import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const project = new Project({
      client: req.user.id,
      title,
      description,
      budget,
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("client", "name email");
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// ✅ New controller
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.id }).populate("client", "name email");
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
