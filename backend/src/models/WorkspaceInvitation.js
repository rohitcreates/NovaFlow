import mongoose from "mongoose";

const workspaceInvitationSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },

        invitedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        role: {
            type: String,
            enum: ["viewer", "member"],
            default: "member",
            required: true,
        },

        token: {
            type: String,
            required: true,
            unique: true,
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "expired", "cancelled"],
            default: "pending",
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "WorkspaceInvitation",
    workspaceInvitationSchema
);