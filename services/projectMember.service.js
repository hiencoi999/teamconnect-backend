const { verifyObjectId } = require("../helpers/validate.helper");
const ProjectMember = require("../models/projectMember.model");
const TaskGroup = require("../models/taskGroup.model");
const User = require("../models/user.model");
async function createProjectMember(projectId, userId, role) {
  const existedMember = await ProjectMember.findOne({
    $and: [{ project: projectId, user: userId, isDeleted: true }],
  });
  if (existedMember) {
    existedMember.isDeleted = false;
    await existedMember.save();
    return existedMember;
  }
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
    assignee: newProjectMember._id,
  });
  await Promise.all([assigneeGroup.save(), newProjectMember.save()]);
  return newProjectMember;
}

async function getProjectMemberByProjectId(projectId) {
  if (projectId) {
    const members = await ProjectMember.find({
      $and: [{ project: projectId, isDeleted: false }],
    })
      .populate({ path: "user" })
      .exec();

    return members;
  }
  return false;
}

async function removeMember(memberId) {
  if (!verifyObjectId(memberId)) return;
  const member = await ProjectMember.updateOne(
    { _id: memberId },
    { isDeleted: true }
  );
  // if(!member) return;
  // const channels = await
  return member;
}

async function isProjectMember(projectId, userId) {
  const member = await ProjectMember.findOne({project: projectId, user: userId, isDeleted: false})
  if(member) return true;
  else return false;
}

module.exports = {
  createProjectMember,
  getProjectMemberByProjectId,
  removeMember,
  isProjectMember
};
