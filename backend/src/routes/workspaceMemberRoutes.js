import express from "express";

import {
    getWorkspaceMembers,
} from "../controllers/workspaceMemberController.js";

import { protect } from "../middleware/authMiddleware.js";
import { loadWorkspace } from "../middleware/workspaceMiddleware.js";
import {
    loadWorkspaceMembership,
} from "../middleware/workspacePermissionMiddleware.js";

const router = express.Router();

router.get(
    "/:workspaceId/members",
    protect,
    loadWorkspace,
    loadWorkspaceMembership,
    getWorkspaceMembers
);

export default router;