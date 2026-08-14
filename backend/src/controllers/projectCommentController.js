import ProjectComment from "../models/ProjectComment.js";

export const createProjectComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Comment content is required",
            });
        }

        const comment = await ProjectComment.create({
            project: req.project._id,
            user: req.user._id,
            content: content.trim(),
        });

        await comment.populate("user", "name email avatar");

        return res.status(201).json({
            message: "Project comment created successfully",
            comment,
        });
    } catch (error) {
        console.error("Error creating project comment:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getProjectComments = async (req, res) => {
    try {
        const comments = await ProjectComment.find({
            project: req.project._id,
        })
            .populate("user", "name email avatar")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            comments,
        });
    } catch (error) {
        console.error("Error getting project comments:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateProjectComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Comment content is required",
            });
        }

        const comment = await ProjectComment.findOne({
            _id: commentId,
            project: req.project._id,
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        if (
            comment.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only edit your own comments",
            });
        }

        comment.content = content.trim();

        await comment.save();

        await comment.populate("user", "name email avatar");

        return res.status(200).json({
            message: "Project comment updated successfully",
            comment,
        });
    } catch (error) {
        console.error("Error updating project comment:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const deleteProjectComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await ProjectComment.findOne({
            _id: commentId,
            project: req.project._id,
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        if (
            comment.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only delete your own comments",
            });
        }

        await comment.deleteOne();

        return res.status(200).json({
            message: "Project comment deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting project comment:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};