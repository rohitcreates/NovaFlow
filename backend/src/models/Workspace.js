import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Workspace name is required"],
        trim: true,
        minlength: [3, "Workspace name must be at least 3 characters"],
        maxlength: [50, "Workspace name cannot exceed 50 characters"],
    },

    description: {
        type: String,
        trim: true,
        default: "",
        maxlength: [300, "Workspace description cannot exceed 300 characters"],
    },

    coverImage: {
        type: String,
       default: "default.jpg",
    },

    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },

    archived: {
        type: Boolean,
        default: false,
    },




}, {
    timestamps: true,
});

export default mongoose.model("Workspace", workspaceSchema);