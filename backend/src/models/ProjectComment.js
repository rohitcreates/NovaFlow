import mongoose from "mongoose";

const projectCommentSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
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
            minlength: 1,
            maxlength: 2000,
        },
    },
    {
        timestamps: true,
    }
);

const ProjectComment = mongoose.model(
    "ProjectComment",
    projectCommentSchema
);

export default ProjectComment;