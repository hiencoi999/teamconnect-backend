const TaskGroup = require("../models/taskGroup.model");
const Task = require("../models/task.model");
const File = require("../models/file.model");
const Comment = require("../models/comment.model");
const { getProject } = require("./project.service");
const { verifyObjectId } = require("../helpers/validate.helper");
var mongoose = require("mongoose");

async function createTask(projectId, title) {
  if (!title) return;

  const project = await getProject(projectId);
  if (!project) return;

  const statusGroup = await TaskGroup.findOne({
    project: projectId,
    type: "START",
  }).exec();

  const priorityGroup = await TaskGroup.findOne({
    project: projectId,
    groupBy: "PRIORITY",
    name: "Medium",
  });

  const assigneeGroup = await TaskGroup.findOne({
    project: projectId,
    groupBy: "ASSIGNEE",
    assignee: null,
  });

  project.latestTask++;

  const task = new Task({
    title: title,
    key: project.latestTask,
    status: statusGroup.name,
  });
  statusGroup.tasks.push(task._id);
  priorityGroup.tasks.push(task._id);
  assigneeGroup.tasks.push(task._id);
  await Promise.all([
    project.save(),
    task.save(),
    statusGroup.save(),
    priorityGroup.save(),
    assigneeGroup.save(),
  ]);
  return task;
}

async function getAllTask(projectId, groupBy) {
  if (!verifyObjectId(projectId)) return false;
  const taskGroups = await TaskGroup.find({
    $and: [{ project: projectId, groupBy: groupBy }],
  })
    .populate({
      path: "tasks",
      populate: {
        path: "assignee",
        populate: {
          path: "user",
        },
      },
    })
    .sort({ order: "asc" })
    .exec();

  return taskGroups;
}

async function getOneTask(taskId) {
  if (!verifyObjectId(taskId)) return;

  const task = await Task.findOne({ _id: taskId })
    .populate({
      path: "assignee",
      populate: {
        path: "user",
      },
    })
    .exec();
  return task;
}

async function deleteTask(projectId, taskId) {
  if (!verifyObjectId(projectId) || !verifyObjectId(taskId)) return;
  const task = await Task.findOne({ _id: taskId });
  if (!task) return;

  const statusGroup = await TaskGroup.findOne({
    project: projectId,
    name: task.status,
    groupBy: "STATUS",
  });
  const statusIndex = statusGroup.tasks.indexOf(taskId);
  statusGroup.tasks.splice(statusIndex, 1);
  await statusGroup.save();

  const assigneeGroup = await TaskGroup.findOne({
    project: projectId,
    assignee: task.assignee,
    groupBy: "ASSIGNEE",
  });
  const assigneeIndex = assigneeGroup.tasks.indexOf(taskId);
  assigneeGroup.tasks.splice(assigneeIndex, 1);
  await assigneeGroup.save();

  const priorityGroup = await TaskGroup.findOne({
    project: projectId,
    name: task.priority,
    groupBy: "PRIORITY",
  });
  const priorityIndex = priorityGroup.tasks.indexOf(taskId);
  priorityGroup.tasks.splice(priorityIndex, 1);
  await priorityGroup.save();

  await Promise.all([
    File.deleteMany({ task: taskId }),
    Comment.deleteMany({ task: taskId }),
    Task.deleteOne({ _id: taskId }, Comment.deleteMany({ task: taskId })),
  ]);
  return task;
}

async function updateTask(projectId, taskId, task) {
  if (taskId !== task._id) return false;

  const project = await getProject(projectId);
  if (!project) return false;

  const updatedTask = await Task.findOne({ _id: taskId });
  if (!updatedTask) return false;

  updatedTask.description = task.description;
  updatedTask.dueDate = task.dueDate;
  updatedTask.startDate = task.startDate;
  if (updatedTask.status !== task.status) {
    const oldTaskGroup = await TaskGroup.findOne({
      project: projectId,
      name: updatedTask.status,
      groupBy: "STATUS",
    });
    const newTaskGroup = await TaskGroup.findOne({
      project: projectId,
      name: task.status,
      groupBy: "STATUS",
    });
    const index = oldTaskGroup.tasks.indexOf(taskId);

    oldTaskGroup.tasks.splice(index, 1);
    await oldTaskGroup.save();
    newTaskGroup.tasks.push(taskId);
    await newTaskGroup.save();
  } else if (updatedTask.priority !== task.priority) {
    const oldTaskGroup = await TaskGroup.findOne({
      project: projectId,
      name: updatedTask.priority,
      groupBy: "PRIORITY",
    });
    const newTaskGroup = await TaskGroup.findOne({
      project: projectId,
      name: task.priority,
      groupBy: "PRIORITY",
    });

    const index = oldTaskGroup.tasks.indexOf(taskId);

    oldTaskGroup.tasks.splice(index, 1);
    await oldTaskGroup.save();
    newTaskGroup.tasks.push(taskId);
    await newTaskGroup.save();
  } else if (updatedTask?.assignee !== task?.assignee) {
    const oldTaskGroup = await TaskGroup.findOne({
      project: projectId,
      assignee: updatedTask.assignee,
      groupBy: "ASSIGNEE",
    });
    const newTaskGroup = await TaskGroup.findOne({
      project: projectId,
      assignee: task.assignee,
      groupBy: "ASSIGNEE",
    });
    const index = oldTaskGroup.tasks.indexOf(taskId);
    oldTaskGroup.tasks.splice(index, 1);
    await oldTaskGroup.save();
    newTaskGroup.tasks.push(taskId);
    await newTaskGroup.save();
  }
  updatedTask.status = task.status;
  updatedTask.assignee = task.assignee;
  updatedTask.priority = task.priority;
  await updatedTask.save();
  return updatedTask;
}

async function addFiles(taskId, fileName) {
  if (!taskId || !fileName) return false;
  const file = new File({
    name: fileName,
    task: taskId,
  });
  await file.save();
  return file;
}

async function deleteFile(projectId, taskId, fileId) {
  const project = await getProject(projectId);
  if (!project) return;

  const task = await getOneTask(taskId);
  if (!task) return;

  const deletedFile = await File.deleteOne({ _id: fileId });
  if (!deletedFile) return;
  return deletedFile;
}

async function getFilesByTaskId(taskId) {
  const task = await Task.findOne({ _id: taskId });
  if (!task) return false;

  const files = await File.find({ task: taskId });
  return files;
}

module.exports = {
  createTask,
  getAllTask,
  getOneTask,
  deleteTask,
  updateTask,
  addFiles,
  deleteFile,
  getFilesByTaskId,
};
