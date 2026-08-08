import ProjectDocumentation from "../models/ProjectDocumentation.js";

export const getProjectDocumentation = async (req, res) => {
    try {
        let documentation = await ProjectDocumentation.findOne({
            project: req.project._id,
        }).populate("updatedBy", "name email");

        // Create the documentation automatically
        // if this project doesn't have one yet.
        if (!documentation) {
            documentation = await ProjectDocumentation.create({
                project: req.project._id,
                content: "",
                updatedBy: req.user._id,
            });

            await documentation.populate(
                "updatedBy",
                "name email"
            );
        }

        return res.status(200).json(documentation);
    } catch (error) {
        console.error(
            "Error getting project documentation:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateProjectDocumentation = async (req, res) => {
    try {
        const { content } = req.body;

        if (content === undefined) {
            return res.status(400).json({
                message: "Content is required",
            });
        }

        let documentation = await ProjectDocumentation.findOne({
            project: req.project._id,
        });

        if (!documentation) {
            documentation = new ProjectDocumentation({
                project: req.project._id,
            });
        }

        documentation.content = content;
        documentation.updatedBy = req.user._id;

        await documentation.save();

        await documentation.populate(
            "updatedBy",
            "name email"
        );

        return res.status(200).json(documentation);
    } catch (error) {
        console.error(
            "Error updating project documentation:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};