const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "channel" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "message" }
);

module.exports = mongoose.model("message", messageSchema);
