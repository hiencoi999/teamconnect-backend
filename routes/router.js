const express = require("express");
const authRouter = require("./auth.route.js");
const projectRouter = require("./project.route");
const channelRouter = require("./channel.route")
const taskGroupRouter = require("./taskGroup.route")
const userRouter = require("./user.route");
const taskRouter = require("./task.route");
const apiRoute = express();

apiRoute.use("/login", authRouter);

//need authorize before use all routes below
apiRoute.use(require("../middlewares/auth.middleware.js"));

apiRoute.use("/user", userRouter);
apiRoute.use("/projects", projectRouter);
apiRoute.use("/channels", channelRouter)
apiRoute.use("/projects", taskRouter);
apiRoute.use("/projects", taskGroupRouter);

module.exports = apiRoute;
