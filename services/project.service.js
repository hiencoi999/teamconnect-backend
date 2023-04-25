const Project = require("../models/project.model");
const ProjectMember = require("../models/projectMember.model");
const TaskGroup = require("../models/taskGroup.model");
const Task = require("../models/task.model");
const Invitation = require("../models/invitation.model");
const Channel = require("../models/channel.model");
const ChannelMember = require("../models/channelMember.model");
const ObjectId = require("mongoose").Types.ObjectId;
const {
  createProjectMember,
  getProjectMemberByProjectId,
} = require("./projectMember.service");
const { verifyObjectId } = require("../helpers/validate.helper");

async function createProject(projectName, projectDescription, userId) {
  const newProject = new Project({
    name: projectName,
    description: projectDescription,
  });
  const defaultTaskGroup1 = new TaskGroup({
    project: newProject._id,
    name: "To Do",
    order: 1,
    type: "START",
  });
  const defaultTaskGroup2 = new TaskGroup({
    project: newProject._id,
    name: "In Progress",
    order: 2,
    type: "DOING"
  });
  const defaultTaskGroup3 = new TaskGroup({
    project: newProject._id,
    name: "Done",
    order: 3,
    type: "END",
  });

  const unassignedGroup = new TaskGroup({
    project: newProject._id,
    name: "Unassigned",
    order: 1,
    groupBy: "ASSIGNEE"
  })

  const priorities = ["Highest", "High", "Medium", "Low", "Lowest"]
  priorities.forEach(async (element, index) => {
    const priorityGroup = new TaskGroup({
      project: newProject._id,
      name: element,
      order: index+1,
      groupBy: "PRIORITY"
    })
    await priorityGroup.save()
  })
  

  await Promise.all([
    defaultTaskGroup1.save(),
    defaultTaskGroup2.save(),
    defaultTaskGroup3.save(),
    unassignedGroup.save(),
    newProject.save(),
    createProjectMember(newProject._id, userId, "LEADER"),
  ]);
  return newProject;
}

async function getProjectsByUserId(userId, isDeleted) {
  const projects = await ProjectMember.find({ user: userId })
    .populate({ path: "project" })
    .exec();
  const data = projects.filter(
    (project) => project.project.isDeleted === isDeleted
  );
  data.sort(function (a, b) {
    return new Date(b.project.createdAt - a.project.createdAt);
  });
  return data;
}

async function getProject(projectId) {
  if (!verifyObjectId(projectId)) return;
  const project = await Project.findOne({ _id: projectId });
  if (!project) return false;
  return project;
}

async function getProjectAndMembers(projectId) {
  if (!ObjectId.isValid(projectId)) return false;
  const project = await Project.findOne({ _id: projectId });
  if (!project) return false;
  const members = await getProjectMemberByProjectId(projectId);
  return { project, members };
}

async function deleteProject(userId, projectId) {
  const member = await ProjectMember.findOne({ user: userId });
  if (!member) return;

  await Project.findOneAndUpdate(
    { _id: projectId },
    { isDeleted: true, deletedAt: new Date() }
  );
  await Channel.updateMany({ project: projectId }, { isDeleted: true });
  return true;
}

async function deletePermanentProjects() {
  Date.prototype.subtractDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
  };
  today = new Date();
  deletedDate = today.subtractDays(0);
  const items = await Project.find({ deletedAt: { $lt: deletedDate } });
  await Promise.all(
    items.map(async (item) => {
      const groups = await TaskGroup.find({ project: item._id });
      const deletedChannel = await Channel.findOne({ project: item._id });
      Promise.all([
        await Project.deleteOne({ _id: item._id }),
        await ProjectMember.deleteMany({ project: item._id }),
        await Invitation.deleteMany({ project: item._id }),
        await Promise.all(
          groups.map(async (group) => {
            await Task.deleteMany({ _id: { $in: group.tasks } });
          })
        ),
        await TaskGroup.deleteMany({ project: item._id }),
        await Channel.deleteOne({ project: item._id }),
        await ChannelMember.deleteMany({ channel: deletedChannel._id }),
      ]);
    })
  );
}

async function renameProject(projectId, newName) {
  if(!verifyObjectId(projectId || !newName)) return;
  const project = await Project.findOne({_id: projectId})
  if(!project) return;
  const channel = await Channel.findOne({project: projectId, isGlobal: true})
  project.name = newName;
  channel.name = newName;
  await project.save()
  await channel.save()
  return project;
}

module.exports = {
  createProject,
  getProjectsByUserId,
  getProject,
  getProjectAndMembers,
  deleteProject,
  deletePermanentProjects,
  renameProject
};
