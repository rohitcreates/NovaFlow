import express from "express";

import {
    getTaskNote,
    createTaskNote,
    updateTaskNote,
} from "../controllers/taskNoteController.js";

import { protect } from "../middleware/authMiddleware.js";
import { loadWorkspace } from "../middleware/workspaceMiddleware.js";
import {
    loadWorkspaceMembership,
    isMemberOrOwner,
} from "../middleware/workspacePermissionMiddleware.js";
import { loadProject } from "../middleware/projectMiddleware.js";
import { loadTask } from "../middleware/taskMiddleware.js";

const router = express.Router();

router.get(
    "/:workspaceId/projects/:projectId/tasks/:taskId/note",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    loadTask,
    getTaskNote
);

router.post(
    "/:workspaceId/projects/:projectId/tasks/:taskId/note",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isMemberOrOwner,
    loadProject,
    loadTask,
    createTaskNote
);

router.patch(
    "/:workspaceId/projects/:projectId/tasks/:taskId/note",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isMemberOrOwner,
    loadProject,
    loadTask,
    updateTaskNote
);

export default router;