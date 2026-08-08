import express from "express";

import {
    createWorkspace,
    getWorkspaces,
     getWorkspaceById,
    // updateWorkspace,
    // archiveWorkspace,
} from "../controllers/workspaceController.js";

import { protect } from "../middleware/authMiddleware.js";

import { loadWorkspace } from "../middleware/workspaceMiddleware.js";

import {
    loadWorkspaceMembership,
    isOwner,
} from "../middleware/workspacePermissionMiddleware.js";

const router = express.Router();

router.post("/", protect, createWorkspace);
router.get("/", protect, getWorkspaces);
router.get(
  "/:workspaceId",
  protect,
  loadWorkspace,
  loadWorkspaceMembership,
  getWorkspaceById
);
// router.patch(
//   "/:workspaceId",
//   protect,
//   loadWorkspace,
//   loadWorkspaceMembership,
//   isOwner,
//   updateWorkspace
// );
// router.patch(
//   "/:workspaceId/archive",
//   protect,
//   loadWorkspace,
//   isOwner,
//   archiveWorkspace
// );


export default router;