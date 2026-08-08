import mongoose from "mongoose";

const projectDocumentationSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            unique: true,
        },

        content: {
            type: String,
            default: "",
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

const ProjectDocumentation = mongoose.model(
    "ProjectDocumentation",
    projectDocumentationSchema
);

export default ProjectDocumentation;