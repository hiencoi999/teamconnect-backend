const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: {type: String},
    task: {type: mongoose.Schema.Types.ObjectId, ref: "task"}
  }
);

module.exports = mongoose.model("file", fileSchema);
