const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const connectDB = async () => {

  const DB_URL = `mongodb://127.0.0.1:27017/ktln`;

  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((error) => console.log(error));
};

module.exports = connectDB;
