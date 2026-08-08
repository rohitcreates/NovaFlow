import express from "express";

import {
    getProjectDocumentation,
    updateProjectDocumentation,
} from "../controllers/projectDocumentationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { loadWorkspace } from "../middleware/workspaceMiddleware.js";
import {
    loadWorkspaceMembership,
    isMemberOrOwner,
} from "../middleware/workspacePermissionMiddleware.js";
import { loadProject } from "../middleware/projectMiddleware.js";

const router = express.Router();

router.get(
    "/:workspaceId/projects/:projectId/documentation",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    getProjectDocumentation
);

router.patch(
    "/:workspaceId/projects/:projectId/documentation",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isMemberOrOwner,
    loadProject,
    updateProjectDocumentation
);

export default router;