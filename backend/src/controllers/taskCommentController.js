import TaskComment from "../models/TaskComment.js";

export const createTaskComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content?.trim()) {
            return res.status(400).json({
                message: "Comment content is required",
            });
        }

        const comment = await TaskComment.create({
            task: req.task._id,
            user: req.user._id,
            content: content.trim(),
        });

        await comment.populate("user", "name email");

        return res.status(201).json({
            message: "Comment created successfully",
            comment,
        });
    } catch (error) {
        console.error("Error creating task comment:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getTaskComments = async (req, res) => {
    try {
        const comments = await TaskComment.find({
            task: req.task._id,
        })
            .populate("user", "name email")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            comments,
        });
    } catch (error) {
        console.error("Error getting task comments:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateTaskComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        if (!content?.trim()) {
            return res.status(400).json({
                message: "Comment content is required",
            });
        }

        const comment = await TaskComment.findOne({
            _id: commentId,
            task: req.task._id,
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only edit your own comments",
            });
        }

        comment.content = content.trim();

        await comment.save();

        await comment.populate("user", "name email");

        return res.status(200).json({
            message: "Comment updated successfully",
            comment,
        });
    } catch (error) {
        console.error("Error updating task comment:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const deleteTaskComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await TaskComment.findOne({
            _id: commentId,
            task: req.task._id,
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only delete your own comments",
            });
        }

        await comment.deleteOne();

        return res.status(200).json({
            message: "Comment deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting task comment:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};