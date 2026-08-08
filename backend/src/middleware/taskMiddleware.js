import Task from "../models/Task.js";

export const loadTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.taskId,
            project: req.project._id,
            archived: false,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        req.task = task;

        next();
    } catch (error) {
        console.error("Error loading task:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};