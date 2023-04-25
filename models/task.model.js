const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    key: { type: Number },
    title: { type: String },
    description: { type: String, default: null },
    status: {type: String},
    priority: { type: String, enum: ["Highest", "High", "Medium", "Low", "Lowest"], default: "Medium" },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "project_member", default: null},
    dueDate: { type: Date, default: null },
    startDate: {type: Date, default: null},
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "task" }
);

module.exports = mongoose.model("task", taskSchema);
