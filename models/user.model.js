const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    picture: {
      type: String,
    },
  },
  { collection: "user" }
);

module.exports = mongoose.model("user", userSchema);
