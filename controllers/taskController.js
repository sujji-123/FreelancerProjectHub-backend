import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    // FIX: Expect 'project' from the request body, not 'project_id'
    const { project, title } = req.body;
    const task = await Task.create({ project, title, status: 'todo' });
    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    // FIX: Query by 'project' field
    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ error: err.message });
  }
};