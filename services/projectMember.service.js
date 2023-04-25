const ProjectMember = require("../models/projectMember.model");
const TaskGroup = require("../models/taskGroup.model");
const User = require("../models/user.model");
async function createProjectMember(projectId, userId, role) {
  const newProjectMember = new ProjectMember({
    project: projectId,
    user: userId,
    role,
  });
  const user = await User.findOne({ _id: userId });
  const count = await TaskGroup.count({
    $and: [{ project: projectId, groupBy: "ASSIGNEE" }],
  });
  const assigneeGroup = new TaskGroup({
    name: user.firstName + " " + user.lastName,
    groupBy: "ASSIGNEE",
    project: projectId,
    order: count + 1,
    assignee: newProjectMember._id
  });
  await Promise.all([assigneeGroup.save(), newProjectMember.save()]);
  return newProjectMember;
}

async function getProjectMemberByProjectId(projectId) {
  if (projectId) {
    const members = await ProjectMember.find({ project: projectId })
      .populate({ path: "user" })
      .exec();

    return members;
  }
  return false;
}

module.exports = { createProjectMember, getProjectMemberByProjectId };
