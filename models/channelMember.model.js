const mongoose = require("mongoose");

const channelMemberSchema = new mongoose.Schema(
  {
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "channel" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    unReadMessages: {type: Number, default: 0}
  },
  { collection: "channel_member" }
);

module.exports = mongoose.model("channel_member", channelMemberSchema);
