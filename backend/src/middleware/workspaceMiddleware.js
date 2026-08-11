import Workspace from "../models/Workspace.js";

export const loadWorkspace = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById({ _id: workspaceId, archived: false });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    req.workspace = workspace;
    next();
  } catch (error) {
    console.error("Error loading workspace:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
