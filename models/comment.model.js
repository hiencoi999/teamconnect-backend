const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "task" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "comment" }
);

module.exports = mongoose.model("comment", commentSchema);
