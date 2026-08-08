import express from "express";

import {
    createTaskComment,
    getTaskComments,
    updateTaskComment,
    deleteTaskComment,
} from "../controllers/taskCommentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { loadWorkspace } from "../middleware/workspaceMiddleware.js";

import {
    loadWorkspaceMembership,
} from "../middleware/workspacePermissionMiddleware.js";

import { loadProject } from "../middleware/projectMiddleware.js";
import { loadTask } from "../middleware/taskMiddleware.js";

const router = express.Router();

router.post(
    "/:workspaceId/projects/:projectId/tasks/:taskId/comments",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    loadTask,
    createTaskComment
);

router.get(
    "/:workspaceId/projects/:projectId/tasks/:taskId/comments",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    loadTask,
    getTaskComments
);

router.patch(
    "/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    loadTask,
    updateTaskComment
);

router.delete(
    "/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    loadTask,
    deleteTaskComment
);

export default router;