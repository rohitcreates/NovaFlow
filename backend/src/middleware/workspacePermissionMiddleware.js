import WorkspaceMember from "../models/WorkspaceMember.js";

export const loadWorkspaceMembership = async (req, res, next) => {
    try {
        const membership = await WorkspaceMember.findOne({
    workspace: req.workspace._id,
    user: req.user._id,
});
if (!membership) {
    return res.status(403).json({ message: "Access denied" });
}

        req.membership = membership;

        return next();
    } catch (error) {
        console.error("Error loading membership:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const isOwner = (req, res, next) => {
    if (req.membership.role !== "owner") {
        return res.status(403).json({ message: "Access denied. Only owners can perform this action." });
    }
   return next();
};

export const isMemberOrOwner = (req, res, next) => {
    if (req.membership.role !== "owner" && req.membership.role !== "member") {
        return res.status(403).json({ message: "Access denied. Only members or owners can perform this action." });
    }
    return next();
};