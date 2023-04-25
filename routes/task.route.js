const express = require("express");
const CommentController = require("../controllers/comment.controller.js");
const TaskController = require("../controllers/task.controller.js");

const router = express.Router();

router.post("/:projectId/tasks", TaskController.create);
router.get("/:projectId/tasks", TaskController.getAll);
router.put("/:projectId/tasks", TaskController.updateTaskGroups)

router.get("/:projectId/tasks/:taskId", TaskController.getOne)
router.put("/:projectId/tasks/:taskId", TaskController.updateOne)
router.delete("/:projectId/tasks/:taskId", TaskController.deleteOne);

router.post("/:projectId/tasks/:taskId/upload-url", TaskController.getUploadUrlFromTask)
router.post("/:projectId/tasks/:taskId/upload-url-editor", TaskController.getUploadUrlFromComment)
router.post("/:projectId/tasks/:taskId/download-url", TaskController.getDownloadUrl)
router.get("/:projectId/tasks/:taskId/files", TaskController.getAllFiles)
router.delete("/:projectId/tasks/:taskId/files/:fileId", TaskController.deleteOneFile)

router.post("/:projectId/tasks/:taskId/comments", CommentController.createComment)
router.get("/:projectId/tasks/:taskId/comments", CommentController.getComments)
router.put("/:projectId/tasks/:taskId/comments/:commentId", CommentController.updateComment)
router.delete("/:projectId/tasks/:taskId/comments/:commentId", CommentController.deleteComment)


module.exports = router;
