import express from "express";

import {
    createProjectComment,
    getProjectComments,
    updateProjectComment,
    deleteProjectComment,
} from "../controllers/projectCommentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { loadWorkspace } from "../middleware/workspaceMiddleware.js";
import { loadWorkspaceMembership } from "../middleware/workspacePermissionMiddleware.js";
import { loadProject } from "../middleware/projectMiddleware.js";

const router = express.Router();

router.post(
    "/:workspaceId/projects/:projectId/comments",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    createProjectComment
);

router.get(
    "/:workspaceId/projects/:projectId/comments",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    getProjectComments
);

router.patch(
    "/:workspaceId/projects/:projectId/comments/:commentId",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    updateProjectComment
);

router.delete(
    "/:workspaceId/projects/:projectId/comments/:commentId",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    loadProject,
    deleteProjectComment
);

export default router;