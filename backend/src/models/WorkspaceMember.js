import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        enum: ["owner", "viewer", "member"],
        default:"viewer",
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    
},
{
        timestamps: true,
    });

    workspaceMemberSchema.index(
  { workspace: 1, user: 1 },
  { unique: true }
);

export default mongoose.model("WorkspaceMember", workspaceMemberSchema);