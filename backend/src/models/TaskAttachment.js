import mongoose from "mongoose";

const taskAttachmentSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        originalName: {
            type: String,
            required: true,
        },

        storedName: {
            type: String,
            required: true,
        },

        mimeType: {
            type: String,
            required: true,
        },

        size: {
            type: Number,
            required: true,
        },

        filePath: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const TaskAttachment = mongoose.model(
    "TaskAttachment",
    taskAttachmentSchema
);

export default TaskAttachment;