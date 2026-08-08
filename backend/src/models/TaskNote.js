import mongoose from "mongoose";

const taskNoteSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
            unique: true,
        },

        content: {
            type: String,
            default: "",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const TaskNote = mongoose.model("TaskNote", taskNoteSchema);

export default TaskNote;