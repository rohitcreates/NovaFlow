import WorkspaceMember from "../models/WorkspaceMember.js";

export const getWorkspaceMembers = async (req, res) => {
    try {
        const members = await WorkspaceMember.find({
            workspace: req.workspace._id,
        }).populate("user", "name email");

        return res.status(200).json({
            members,
        });
    } catch (error) {
        console.error("Error fetching workspace members:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};