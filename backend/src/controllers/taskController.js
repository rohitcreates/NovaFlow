import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            assignees,
            dueDate,
        } = req.body;

        const projectId = req.params.projectId;
        const userId = req.user._id;

        if (!title) {
            return res.status(400).json({
                message: "Title is required",
            });
        }

        const task = new Task({
            title,
            description,
            status,
            priority,
            assignees,
            dueDate,
            project: projectId,
            createdBy: userId,
        });

        await task.save();

        return res.status(201).json(task);
    } catch (error) {
        console.error("Error creating task:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};