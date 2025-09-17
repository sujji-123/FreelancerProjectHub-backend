import mongoose from "mongoose";

const deliverableSchema = new mongoose.Schema(
  {
    // FIX: Changed 'project_id' to 'project'
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    // FIX: Changed 'file_url' to 'fileUrl' for consistency
    fileUrl: { type: String, required: true },
    description: { type: String },
    // FIX: Changed enum values to lowercase
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    // FIX: Changed 'uploaded_by' to 'uploadedBy'
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Deliverable", deliverableSchema);