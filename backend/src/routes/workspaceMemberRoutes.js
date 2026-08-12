import express from "express";

import {
    getWorkspaceMembers,
    removeMember,
    updateMemberRole,
} from "../controllers/workspaceMemberController.js";

import { protect } from "../middleware/authMiddleware.js";

import { loadWorkspace } from "../middleware/workspaceMiddleware.js";

import {
    loadWorkspaceMembership,
    isOwner,
} from "../middleware/workspacePermissionMiddleware.js";

const router = express.Router();


// Get workspace members
router.get(
    "/:workspaceId/members",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    getWorkspaceMembers
);


// Remove workspace member
router.delete(
    "/:workspaceId/members/:userId",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isOwner,
    removeMember
);


// Update workspace member role
router.patch(
    "/:workspaceId/members/:userId",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isOwner,
    updateMemberRole
);


export default router;