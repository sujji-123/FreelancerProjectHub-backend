import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    // FIX: Changed 'project_id' to 'project'
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    // FIX: Changed enum values to lowercase to match frontend logic
    status: { type: String, enum: ["todo", "inprogress", "done"], default: "todo" },
    // FIX: Changed 'assigned_to' to 'assignedTo' for consistency
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);