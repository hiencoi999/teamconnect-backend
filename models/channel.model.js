const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: { type: String },
    project: {type: mongoose.Schema.Types.ObjectId, ref: "project"},
    isGlobal: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    isDeleted: {type: Boolean, default: false}
  },
  { collection: "channel" }
);

module.exports = mongoose.model("channel", channelSchema);
