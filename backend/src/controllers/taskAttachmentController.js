import TaskAttachment from "../models/TaskAttachment.js";
import fs from "fs";

export const uploadTaskAttachment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "File is required",
            });
        }

        const attachment = await TaskAttachment.create({
            task: req.task._id,
            uploadedBy: req.user._id,
            originalName: req.file.originalname,
            storedName: req.file.filename,
            mimeType: req.file.mimetype,
            size: req.file.size,
            filePath: req.file.path,
        });

        await attachment.populate(
            "uploadedBy",
            "name email"
        );

        return res.status(201).json({
            message: "Attachment uploaded successfully",
            attachment,
        });
    } catch (error) {
        console.error("Error uploading attachment:", error);

        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getTaskAttachments = async (req, res) => {
    try {
        const attachments = await TaskAttachment.find({
            task: req.task._id,
        })
            .populate("uploadedBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            attachments,
        });
    } catch (error) {
        console.error("Error getting task attachments:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const deleteTaskAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;

        const attachment = await TaskAttachment.findOne({
            _id: attachmentId,
            task: req.task._id,
        });

        if (!attachment) {
            return res.status(404).json({
                message: "Attachment not found",
            });
        }

        const isOwner =
            req.user._id.toString() ===
            attachment.uploadedBy.toString();

        const isWorkspaceOwner =
            req.membership.role === "owner";

        if (!isOwner && !isWorkspaceOwner) {
            return res.status(403).json({
                message: "You cannot delete this attachment",
            });
        }

        if (
            attachment.filePath &&
            fs.existsSync(attachment.filePath)
        ) {
            fs.unlinkSync(attachment.filePath);
        }

        await attachment.deleteOne();

        return res.status(200).json({
            message: "Attachment deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting task attachment:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};