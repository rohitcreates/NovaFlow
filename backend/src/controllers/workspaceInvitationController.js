import crypto from "crypto";
import WorkspaceInvitation from "../models/WorkspaceInvitation.js";
import WorkspaceMember from "../models/WorkspaceMember.js";

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

export const acceptInvitation = async (req, res) => {
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

        const existingMembership = await WorkspaceMember.findOne({
            workspace: invitation.workspace,
            user: req.user._id,
        });

        if (existingMembership) {
            return res.status(400).json({
                message: "You are already a member of this workspace",
            });
        }

        await WorkspaceMember.create({
            workspace: invitation.workspace,
            user: req.user._id,
            role: invitation.role,
        });

        invitation.status = "accepted";
        await invitation.save();

        return res.status(200).json({
            message: "Invitation accepted successfully",
        });
    } catch (error) {
        console.error("Error accepting invitation:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};