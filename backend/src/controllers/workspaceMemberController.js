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

export const removeMember = async (req, res) => {
    try {
        const { userId } = req.params;

        const membership = await WorkspaceMember.findOne({
            workspace: req.workspace._id,
            user: userId,
        });

        if (!membership) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        if (membership.role === "owner") {
            return res.status(400).json({
                message: "Workspace owner cannot be removed",
            });
        }

        await membership.deleteOne();

        return res.status(200).json({
            message: "Member removed successfully",
        });
    } catch (error) {
        console.error("Error removing member:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateMemberRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!["member", "viewer"].includes(role)) {
            return res.status(400).json({
                message: "Invalid member role",
            });
        }

        const membership = await WorkspaceMember.findOne({
            workspace: req.workspace._id,
            user: userId,
        });

        if (!membership) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        if (membership.role === "owner") {
            return res.status(400).json({
                message: "Workspace owner role cannot be changed",
            });
        }

        membership.role = role;

        await membership.save();

        const updatedMembership = await WorkspaceMember.findById(
            membership._id
        ).populate("user", "name email");

        return res.status(200).json({
            message: "Member role updated successfully",
            membership: updatedMembership,
        });
    } catch (error) {
        console.error("Error updating member role:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};