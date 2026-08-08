import Project from "../models/Project.js";

export const loadProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            _id: projectId,
            workspace: req.workspace._id,
            archived: false,
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        req.project = project;

        return next();
    } catch (error) {
        console.error("Error loading project:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};