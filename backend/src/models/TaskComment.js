import mongoose from "mongoose";

const taskCommentSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
    },
    {
        timestamps: true,
    }
);

const TaskComment = mongoose.model(
    "TaskComment",
    taskCommentSchema
);

export default TaskComment;