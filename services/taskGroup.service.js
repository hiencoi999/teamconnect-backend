const { verifyObjectId } = require("../helpers/validate.helper");
const TaskGroup = require("../models/taskGroup.model");
const Task = require("../models/task.model");
async function createTaskGroup(projectId, name) {
  const lastGroup = await TaskGroup.findOne({ project: projectId })
    .sort({ order: "desc" })
    .limit(1)
    .exec();

  const newGroup = new TaskGroup({
    project: projectId,
    name: name,
    type: "DOING",
    order: lastGroup.order + 1,
  });
  await newGroup.save();
}

async function updateTaskGroups(
  projectId,
  columns,
  groupBy,
  taskId,
  newGroupId
) {
  const newTasks = columns.map((column) => {
    return column.tasks.map((task) => {
      return task._id;
    });
  });

  for (let i = 0; i < newTasks.length; i++) {
    await TaskGroup.updateOne(
      { order: i + 1, project: projectId, groupBy: groupBy },
      { tasks: newTasks[i] }
    );
  }
  if (newGroupId) {
    const updatedTask = await Task.findOne({ _id: taskId });
    const group = await TaskGroup.findOne({ _id: newGroupId });
    if (groupBy === "STATUS") {
      updatedTask.status = group.name;
      await updatedTask.save();
    }
    if (groupBy === "PRIORITY") {
      updatedTask.priority = group.name;
      await updatedTask.save();
    }
    if (groupBy === "ASSIGNEE") {
      updatedTask.assignee = group.assignee;
      await updatedTask.save()
    }
  }
}

async function updateGroupOrder(projectId, columns, groupBy) {
  for (let i = 0; i < columns.length; i++) {
    await TaskGroup.updateOne(
      { order: i + 1, project: projectId, groupBy: groupBy },
      { order: columns[i].order }
    );
  }
  await Promise.all(
    columns.map(async (column, index) => {
      await TaskGroup.updateOne({ _id: column._id }, { order: index + 1 });
    })
  );
}

async function updateGroupName(groupId, newName) {
  if (!verifyObjectId(groupId)) return;
  if (!newName) return;

  const updatedGroup = await TaskGroup.updateOne(
    { _id: groupId },
    { name: newName }
  );
  return updatedGroup;
}

async function getAllGroupByGroupBy(projectId, groupBy) {
  if (!verifyObjectId(projectId)) return;
  const groups = await TaskGroup.find({
    $and: [{ project: projectId, groupBy: groupBy }],
  }).sort({ order: "asc" });
  return groups;
}

async function deleteGroup(groupId) {
  if (!verifyObjectId(groupId)) return;
  const deletedGroup = await TaskGroup.findOne({_id: groupId})
  if(!deletedGroup) return;
  if(deletedGroup.type !== "DOING") return;
  if(deletedGroup.tasks.length !== 0) return "NOT_EMPTY";
  await TaskGroup.deleteOne({_id: groupId})
  return deletedGroup;
}



module.exports = {
  createTaskGroup,
  updateTaskGroups,
  updateGroupOrder,
  updateGroupName,
  getAllGroupByGroupBy,
  deleteGroup
};
