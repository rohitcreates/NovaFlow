import express from "express";

import {
    createInvitation,
    getMyInvitations,
    acceptInvitation,
    declineInvitation,
} from "../controllers/workspaceInvitationController.js";

import { protect } from "../middleware/authMiddleware.js";

import { loadWorkspace } from "../middleware/workspaceMiddleware.js";

import {
    loadWorkspaceMembership,
    isOwner,
} from "../middleware/workspacePermissionMiddleware.js";

const router = express.Router();


// Create invitation
// Owner only
router.post(
    "/:workspaceId/invitations",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isOwner,
    createInvitation
);


// Get current user's pending invitations
router.get(
    "/invitations/me",
    protect,
    getMyInvitations
);


// Accept invitation
router.post(
    "/invitations/:token/accept",
    protect,
    acceptInvitation
);


// Decline invitation
router.post(
    "/invitations/:token/decline",
    protect,
    declineInvitation
);


export default router;