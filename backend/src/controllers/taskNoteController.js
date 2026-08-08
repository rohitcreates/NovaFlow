import TaskNote from "../models/TaskNote.js";

export const getTaskNote = async (req, res) => {
    try {
        const note = await TaskNote.findOne({
            task: req.task._id,
        }).populate("createdBy updatedBy", "name email");

        if (!note) {
            return res.status(404).json({
                message: "Task note not found",
            });
        }

        return res.status(200).json(note);
    } catch (error) {
        console.error("Error getting task note:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const createTaskNote = async (req, res) => {
    try {
        const { content = "" } = req.body;

        const existingNote = await TaskNote.findOne({
            task: req.task._id,
        });

        if (existingNote) {
            return res.status(409).json({
                message: "Task note already exists",
            });
        }

        const note = await TaskNote.create({
            task: req.task._id,
            content,
            createdBy: req.user._id,
            updatedBy: req.user._id,
        });

        await note.populate("createdBy updatedBy", "name email");

        return res.status(201).json({
            message: "Task note created successfully",
            note,
        });
    } catch (error) {
        console.error("Error creating task note:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateTaskNote = async (req, res) => {
    try {
        const { content } = req.body;

        if (content === undefined) {
            return res.status(400).json({
                message: "Content is required",
            });
        }

        const note = await TaskNote.findOne({
            task: req.task._id,
        });

        if (!note) {
            return res.status(404).json({
                message: "Task note not found",
            });
        }

        note.content = content;
        note.updatedBy = req.user._id;

        await note.save();

        await note.populate("createdBy updatedBy", "name email");

        return res.status(200).json({
            message: "Task note updated successfully",
            note,
        });
    } catch (error) {
        console.error("Error updating task note:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};