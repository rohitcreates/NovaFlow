import Task from "../models/Task.js";
import { validateTaskAssignees } from "../utils/validateTaskAssignees.js";

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

        if (assignees !== undefined) {
            const validAssignees = await validateTaskAssignees(
                req.workspace._id,
                assignees
            );

            if (!validAssignees) {
                return res.status(400).json({
                    message:
                        "One or more assignees are not valid workspace members",
                });
            }
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

export const getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;

        const tasks = await Task.find({
            project: projectId,
            archived: false,
        }).populate(
            "assignees",
            "name email avatar"
        );
        return res.status(200).json(tasks);
    } catch (error) {
        console.error("Error getting tasks:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findOne({
            _id: taskId,
            project: req.project._id,
            archived: false,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        return res.status(200).json(task);
    } catch (error) {
        console.error("Error getting task:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const {
            title,
            description,
            status,
            priority,
            assignees,
            dueDate,
        } = req.body;

        const task = await Task.findOne({
            _id: taskId,
            project: req.project._id,
            archived: false,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        if (title !== undefined) {
            task.title = title;
        }

        if (description !== undefined) {
            task.description = description;
        }

        if (status !== undefined) {
            task.status = status;
        }

        if (priority !== undefined) {
            task.priority = priority;
        }

        if (assignees !== undefined) {
            const validAssignees = await validateTaskAssignees(
                req.workspace._id,
                assignees
            );

            if (!validAssignees) {
                return res.status(400).json({
                    message:
                        "One or more assignees are not valid workspace members",
                });
            }

            task.assignees = assignees;
        }

        if (dueDate !== undefined) {
            task.dueDate = dueDate;
        }

        await task.save();

        return res.status(200).json(task);
    } catch (error) {
        console.error("Error updating task:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const archiveTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findOne({
            _id: taskId,
            project: req.project._id,
            archived: false,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        task.archived = true;

        await task.save();

        return res.status(200).json({
            message: "Task archived successfully",
            task,
        });
    } catch (error) {
        console.error("Error archiving task:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};