import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  status: {
    type: String,
    enum: ["planning", "in-progress", "completed"],
    default: "planning"
  },
  description: {
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 300,
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true
  },
  archived: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  coverImage: {
    type: String,
    default: null
  },
},
   {
    timestamps: true,
  }

);

const Project = mongoose.model("Project", projectSchema);
export default Project;