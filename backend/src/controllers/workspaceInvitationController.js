import crypto from "crypto";
import WorkspaceInvitation from "../models/WorkspaceInvitation.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import Workspace from "../models/Workspace.js";


// Create invitation
export const createInvitation = async (req, res) => {
    try {
        const { email, role } = req.body;

        const workspaceId = req.workspace._id;
        const userId = req.user._id;

        if (!email?.trim()) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        if (!["member", "viewer"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Prevent inviting someone who is already a member
        const existingUser = await WorkspaceMember.findOne({
            workspace: workspaceId,
        }).populate({
            path: "user",
            match: { email: normalizedEmail },
        });

        if (existingUser?.user) {
            return res.status(400).json({
                message: "This user is already a member of the workspace",
            });
        }

        // Prevent multiple pending invitations
        const existingInvitation = await WorkspaceInvitation.findOne({
            workspace: workspaceId,
            email: normalizedEmail,
            status: "pending",
        });

        if (existingInvitation) {
            return res.status(400).json({
                message: "A pending invitation already exists for this email",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const invitation = await WorkspaceInvitation.create({
            workspace: workspaceId,
            invitedBy: userId,
            email: normalizedEmail,
            role,
            token,
            expiresAt,
        });

        return res.status(201).json({
            message: "Invitation created successfully",
            invitation,
        });
    } catch (error) {
        console.error("Error creating invitation:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


// Get current user's pending invitations
export const getMyInvitations = async (req, res) => {
    try {
        const email = req.user.email.toLowerCase();

        const invitations = await WorkspaceInvitation.find({
            email,
            status: "pending",
            expiresAt: { $gt: new Date() },
        })
            .populate("workspace", "name description coverImage")
            .populate("invitedBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            invitations,
        });
    } catch (error) {
        console.error("Error fetching invitations:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


// Accept invitation
export const acceptInvitation = async (req, res) => {
    try {
        const { token } = req.params;

        const invitation = await WorkspaceInvitation.findOne({
            token,
            status: "pending",
        }).populate("workspace", "name description coverImage");

        if (!invitation) {
            return res.status(404).json({
                message: "Invitation not found or already used",
            });
        }

        if (invitation.expiresAt < new Date()) {
            invitation.status = "expired";
            await invitation.save();

            return res.status(400).json({
                message: "Invitation has expired",
            });
        }

        if (req.user.email.toLowerCase() !== invitation.email) {
            return res.status(403).json({
                message: "This invitation was sent to a different email",
            });
        }

        const existingMembership = await WorkspaceMember.findOne({
            workspace: invitation.workspace._id,
            user: req.user._id,
        });

        if (existingMembership) {
            return res.status(400).json({
                message: "You are already a member of this workspace",
            });
        }

        const membership = await WorkspaceMember.create({
            workspace: invitation.workspace._id,
            user: req.user._id,
            role: invitation.role,
        });

        invitation.status = "accepted";
        await invitation.save();

        return res.status(200).json({
            message: "Invitation accepted successfully",
            workspace: invitation.workspace,
            membership,
        });
    } catch (error) {
        console.error("Error accepting invitation:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


// Decline invitation
export const declineInvitation = async (req, res) => {
    try {
        const { token } = req.params;

        const invitation = await WorkspaceInvitation.findOne({
            token,
            status: "pending",
        });

        if (!invitation) {
            return res.status(404).json({
                message: "Invitation not found or already used",
            });
        }

        if (invitation.expiresAt < new Date()) {
            invitation.status = "expired";
            await invitation.save();

            return res.status(400).json({
                message: "Invitation has expired",
            });
        }

        if (req.user.email.toLowerCase() !== invitation.email) {
            return res.status(403).json({
                message: "This invitation was sent to a different email",
            });
        }

        invitation.status = "cancelled";
        await invitation.save();

        return res.status(200).json({
            message: "Invitation declined successfully",
        });
    } catch (error) {
        console.error("Error declining invitation:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};