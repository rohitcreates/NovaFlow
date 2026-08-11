import express from "express";

import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  archiveWorkspace,
  uploadWorkspaceCover,
} from "../controllers/workspaceController.js";

import { protect } from "../middleware/authMiddleware.js";

import { loadWorkspace } from "../middleware/workspaceMiddleware.js";

import {
  loadWorkspaceMembership,
  isOwner,
} from "../middleware/workspacePermissionMiddleware.js";

import uploadWorkspaceCoverFile from "../middleware/workspaceUploadMiddleware.js";

const router = express.Router();


// Create workspace
router.post(
  "/",
  protect,
  createWorkspace
);


// Get user's workspaces
router.get(
  "/",
  protect,
  getWorkspaces
);


// Get workspace by ID
router.get(
  "/:workspaceId",
  protect,
  loadWorkspace,
  loadWorkspaceMembership,
  getWorkspaceById
);


// Update workspace
router.patch(
  "/:workspaceId",
  protect,
  loadWorkspace,
  loadWorkspaceMembership,
  isOwner,
  updateWorkspace
);


// Archive workspace
router.patch(
  "/:workspaceId/archive",
  protect,
  loadWorkspace,
  loadWorkspaceMembership,
  isOwner,
  archiveWorkspace
);


// Upload workspace cover
router.patch(
  "/:workspaceId/cover",
  protect,
  loadWorkspace,
  loadWorkspaceMembership,
  isOwner,
  uploadWorkspaceCoverFile.single("coverImage"),
  uploadWorkspaceCover
);


export default router;