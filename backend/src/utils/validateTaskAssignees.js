import WorkspaceMember from "../models/WorkspaceMember.js";

export const validateTaskAssignees = async (
    workspaceId,
    assigneeIds
) => {
    if (!Array.isArray(assigneeIds)) {
        return false;
    }

    const members = await WorkspaceMember.find({
        workspace: workspaceId,
        user: { $in: assigneeIds },
        role: { $in: ["owner", "member"] },
    }).select("user");

    return members.length === assigneeIds.length;
};