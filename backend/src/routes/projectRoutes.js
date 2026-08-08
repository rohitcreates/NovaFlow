import express from "express";
import { createProject } from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { loadWorkspace } from "../middleware/workspaceMiddleware.js";
import {
    loadWorkspaceMembership,
    isMemberOrOwner,
    isOwner,
} from "../middleware/workspacePermissionMiddleware.js";
import { getProjects, getProjectById, updateProject,
    archiveProject,
} from "../controllers/projectController.js";


const router = express.Router();

router.post(
    "/:workspaceId/projects",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isMemberOrOwner,
    createProject
);

router.get(
    "/:workspaceId/projects",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    getProjects
);
router.get(
    "/:workspaceId/projects/:projectId",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    getProjectById
);

router.patch(
    "/:workspaceId/projects/:projectId",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isMemberOrOwner,
    updateProject
);

router.patch(
    "/:workspaceId/projects/:projectId/archive",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isOwner,
    archiveProject
);


export default router;