import express from "express";

import { createTask } from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

import { loadWorkspace } from "../middleware/workspaceMiddleware.js";

import {
    loadWorkspaceMembership,
    isMemberOrOwner,
} from "../middleware/workspacePermissionMiddleware.js";

import { loadProject } from "../middleware/projectMiddleware.js";

const router = express.Router();

router.post(
    "/:workspaceId/projects/:projectId/tasks",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isMemberOrOwner,
    loadProject,
    createTask
);

export default router;