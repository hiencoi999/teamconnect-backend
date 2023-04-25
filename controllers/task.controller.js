const {
  createTask,
  getAllTask,
  addFiles,
  getFilesByTaskId,
  updateTask,
  getOneTask,
  deleteFile,
  deleteTask,
} = require("../services/task.service");
const {
  generateUploadURL,
  generateDownloadFileURL,
} = require("../services/upload.service");
const { updateTaskGroups } = require("../services/taskGroup.service");

class TaskController {
  static async create(req, res) {
    try {
      const createdTask = await createTask(
        req.params.projectId,
        req.body.title
      );
      if (!createdTask) res.status(400).json({ message: "Bad request" });
      else res.status(201).json({ message: "created" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const tasks = await getAllTask(req.params.projectId, req.query.groupBy);
      if (!tasks) res.status(400).json({ message: "No tasks found" });
      res.status(200).json({ tasks });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getOne(req, res) {
    try {
      const task = await getOneTask(req.params.taskId);
      if (!task) res.status(400).json({ message: "bad request" });
      res.status(200).json({ task });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async updateOne(req, res) {
    try {
      const newTask = await updateTask(
        req.params.projectId,
        req.params.taskId,
        req.body.updatedTask
      );
      if (!newTask) res.status(400).json({ message: "bad request" });

      res.status(200).json({ message: "updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async deleteOne(req, res) {
    try {
      const deletedTask = await deleteTask(req.params.projectId, req.params.taskId);
      if (!deletedTask) res.status(400).json({ message: "bad request" });
      res.status(200).json({ message: "deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async updateTaskGroups(req, res) {
    try {
      await updateTaskGroups(
        req.params.projectId,
        req.body.columns,
        req.body.groupBy,
        req.body.taskId,
        req.body.newGroupId
      );
      res.status(200).json({ message: "updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getUploadUrlFromTask(req, res) {
    try {
      const file = await addFiles(req.params.taskId, req.body.fileName);
      const fileName = file._id + req.body.fileName;
      const url = await generateUploadURL(fileName);
      res.status(200).json({ url });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getUploadUrlFromComment(req, res) {
    try {
      const fileName = req.params.taskId + req.body.fileName;
      const url = await generateUploadURL(fileName);
      res.status(200).json({ url });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getDownloadUrl(req, res) {
    try {
      const fileName = req.body.fileName;
      await generateDownloadFileURL(fileName);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getAllFiles(req, res) {
    try {
      const files = await getFilesByTaskId(req.params.taskId);
      if (files) {
        res.status(200).json({ files });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async deleteOneFile(req, res) {
    try {
      const deletedFile = await deleteFile(
        req.params.projectId,
        req.params.taskId,
        req.params.fileId
      );
      if (!deletedFile) res.status(400).json({ message: "bad request" });
      res.status(200).json({ message: "deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = TaskController;
