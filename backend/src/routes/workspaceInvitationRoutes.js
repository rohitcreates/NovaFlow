import express from "express";

import {
    createInvitation,acceptInvitation,
} from "../controllers/workspaceInvitationController.js";

import { protect } from "../middleware/authMiddleware.js";

import { loadWorkspace } from "../middleware/workspaceMiddleware.js";

import {
    loadWorkspaceMembership,
    isOwner,
} from "../middleware/workspacePermissionMiddleware.js";

const router = express.Router();

router.post(
    "/:workspaceId/invitations",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    isOwner,
    createInvitation
);

router.post(
    "/invitations/:token/accept",
    protect,
    acceptInvitation
);

export default router;