import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import workspaceInvitationRoutes from "./routes/workspaceInvitationRoutes.js";
import workspaceMemberRoutes from "./routes/workspaceMemberRoutes.js";
import taskCommentRoutes from "./routes/taskCommentRoutes.js";
import taskNoteRoutes from "./routes/taskNoteRoutes.js";
import taskAttachmentRoutes from "./routes/taskAttachmentRoutes.js";
import projectDocumentationRoutes from "./routes/projectDocumentationRoutes.js";
import projectCommentRoutes from "./routes/projectCommentRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/workspaces", projectDocumentationRoutes);
app.use("/api/v1/workspaces", taskNoteRoutes);
app.use("/api/v1/workspaces", taskRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1/workspaces", projectRoutes);
app.use("/api/v1/workspaces", taskAttachmentRoutes);

app.use(
    "/api/v1/workspaces",
    workspaceInvitationRoutes
);

app.use(
    "/api/v1/workspaces",
    workspaceMemberRoutes
);

app.use(
    "/api/v1/workspaces",
    taskCommentRoutes
);
app.use(
    "/api/v1/workspaces",
    projectCommentRoutes
);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);
export default app;