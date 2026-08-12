import Project from "../models/Project.js";

export const createProject = async (req, res) => {
    try {
        const { name, description, coverImage } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Project name is required",
            });
        }

        const project = new Project({
            name,
            description,
            coverImage,
            workspace: req.workspace._id,
            createdBy: req.user._id,
        });

        await project.save();

        return res.status(201).json(project);
    } catch (error) {
        console.error("Error creating project:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            workspace: req.workspace._id,
            archived: false,
        });

        return res.status(200).json(projects);
    } catch (error) {
        console.error("Error getting projects:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            _id: projectId,
            workspace: req.workspace._id,
            archived: false,
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        return res.status(200).json(project);
    } catch (error) {
        console.error("Error getting project:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, description, status, coverImage } = req.body;

        const project = await Project.findOne({
            _id: projectId,
            workspace: req.workspace._id,
            archived: false,
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (name !== undefined) project.name = name;
        if (description !== undefined) project.description = description;
        if (status !== undefined) project.status = status;
        if (coverImage !== undefined) project.coverImage = coverImage;

        await project.save();

        return res.status(200).json(project);
    } catch (error) {
        console.error("Error updating project:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const archiveProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            _id: projectId,
            workspace: req.workspace._id,
            archived: false,
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        project.archived = true;

        await project.save();

        return res.status(200).json({
            message: "Project archived successfully",
            project,
        });
    } catch (error) {
        console.error("Error archiving project:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const uploadProjectCover = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Cover image is required",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      workspace: req.workspace._id,
      archived: false,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.coverImage = `/uploads/projects/${req.file.filename}`;

    await project.save();

    return res.status(200).json({
      message: "Project cover updated successfully",
      project,
    });
  } catch (error) {
    console.error(
      "Error uploading project cover:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};