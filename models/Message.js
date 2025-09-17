import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // FIX: Changed 'project_id' to 'project'
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    // FIX: Changed 'sender_id' to 'sender'
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);