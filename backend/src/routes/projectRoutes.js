import express from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  archiveProject,
  uploadProjectCover,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

import { loadWorkspace } from "../middleware/workspaceMiddleware.js";

import {
  loadWorkspaceMembership,
  isMemberOrOwner,
  isOwner,
} from "../middleware/workspacePermissionMiddleware.js";

import uploadProjectCoverFile from "../middleware/projectUploadMiddleware.js";

const router = express.Router();


// Create project
router.post(
  "/:workspaceId/projects",
  protect,
  loadWorkspace,
  loadWorkspaceMembership,
  isMemberOrOwner,
  createProject
);


// Get projects
router.get(
  "/:workspaceId/projects",
  protect,
  loadWorkspace,
  loadWorkspaceMembership,
  getProjects
);


// Get project by ID
router.get(
  "/:workspaceId/projects/:projectId",
  protect,
  loadWorkspace,
  loadWorkspaceMembership,
  getProjectById
);


// Update project
router.patch(
  "/:workspaceId/projects/:projectId",
  protect,
  loadWorkspace,
  loadWorkspaceMembership,
  isMemberOrOwner,
  updateProject
);


// Upload project cover
router.patch(
  "/:workspaceId/projects/:projectId/cover",
  protect,
  loadWorkspace,
  loadWorkspaceMembership,
  isMemberOrOwner,
  uploadProjectCoverFile.single("coverImage"),
  uploadProjectCover
);


// Archive project
router.patch(
  "/:workspaceId/projects/:projectId/archive",
  protect,
  loadWorkspace,
  loadWorkspaceMembership,
  isOwner,
  archiveProject
);


export default router;