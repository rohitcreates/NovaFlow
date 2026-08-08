import Workspace from "../models/Workspace.js";
import WorkspaceMember from "../models/WorkspaceMember.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name, description, coverImage } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const workspaceName = name.trim();

    const existingWorkspace = await Workspace.findOne({
    owner: req.user._id,
    name: workspaceName,
});

    if (existingWorkspace) {
      return res.status(400).json({ message: "Workspace already exists" });
    }

    const newWorkspace = await Workspace.create({
      name : workspaceName,
      description,
      coverImage,
      owner: req.user._id,
    });
    await WorkspaceMember.create({
    workspace: newWorkspace._id,
    user: req.user._id,
    role: "owner",
});



   return res.status(201).json({ message: "Workspace created successfully", workspace: newWorkspace });

  } catch (error) {
    console.error("Error creating workspace:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkspaces = async (req, res) => {
  try {
  const memberships = await WorkspaceMember.find({
  user: req.user._id,
}).populate("workspace");

const workspaces = memberships.map(
  (membership) => membership.workspace
);

return res.status(200).json({
  workspaces,
});

  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkspaceById = async (req, res) => {
  try {
    const workspace = req.workspace;

    return res.status(200).json({ workspace });
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateWorkspace = async (req, res) => {
    try {
        const { name, description, coverImage } = req.body;

        const workspace = req.workspace;

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    message: "Workspace name cannot be empty",
                });
            }

            workspace.name = name.trim();
        }

        if (description !== undefined) {
            workspace.description = description;
        }

        if (coverImage !== undefined) {
            workspace.coverImage = coverImage;
        }

        await workspace.save();

        return res.status(200).json({
            message: "Workspace updated successfully",
            workspace,
        });
    } catch (error) {
        console.error("Error updating workspace:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const archiveWorkspace = async (req, res) => {
    try {
        const workspace = req.workspace;

        workspace.archived = true;

        await workspace.save();

        return res.status(200).json({
            message: "Workspace archived successfully",
            workspace,
        });
    } catch (error) {
        console.error("Error archiving workspace:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


