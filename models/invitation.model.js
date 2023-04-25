const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    to: { type: String }, //email
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "invitation" }
);

module.exports = mongoose.model("invitation", invitationSchema);
