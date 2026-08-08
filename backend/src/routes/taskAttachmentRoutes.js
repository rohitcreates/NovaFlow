import express from "express";

import {
    uploadTaskAttachment,
    getTaskAttachments,
    deleteTaskAttachment,
} from "../controllers/taskAttachmentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { loadWorkspace } from "../middleware/workspaceMiddleware.js";
import {
    loadWorkspaceMembership,
    isMemberOrOwner,
} from "../middleware/workspacePermissionMiddleware.js";
import { loadProject } from "../middleware/projectMiddleware.js";
import { loadTask } from "../middleware/taskMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
    "/:workspaceId/projects/:projectId/tasks/:taskId/attachments",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isMemberOrOwner,
    loadProject,
    loadTask,
    upload.single("file"),
    uploadTaskAttachment
);

router.get(
    "/:workspaceId/projects/:projectId/tasks/:taskId/attachments",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    loadTask,
    getTaskAttachments
);

router.delete(
    "/:workspaceId/projects/:projectId/tasks/:taskId/attachments/:attachmentId",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    loadTask,
    deleteTaskAttachment
);

export default router;
