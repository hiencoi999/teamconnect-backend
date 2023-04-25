const mongoose = require("mongoose");

const projectMemberSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    role: { type: String, enum: ["LEADER", "MEMBER"] },
  },
  { collection: "project_member" }
);

module.exports = mongoose.model("project_member", projectMemberSchema);
