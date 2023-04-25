const mongoose = require("mongoose");

const taskGroupSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
    name: {type: String},
    order: {type: Number},
    type: {type: String, enum: ["START", "END", "DOING"]},
    groupBy: {type: String, enum: ["STATUS", "PRIORITY", "ASSIGNEE"], default: 'STATUS'},
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: "task", default: []}],
    assignee: {type: mongoose.Schema.Types.ObjectId, ref: "project_member"}
  },
  { collection: "task_group" }
);

module.exports = mongoose.model("task_group", taskGroupSchema);
