const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: {type: String},
    latestTask: {type: Number, default: 0},
    createdAt: { type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now},
    isDeleted: {type: Boolean, default: false},
    deletedAt: {type: Date, default: null}
  },
  { collection: "project" }
);

module.exports = mongoose.model("project", projectSchema);
