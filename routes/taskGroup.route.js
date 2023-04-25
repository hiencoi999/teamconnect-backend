const express = require("express");
const TaskGroupController = require("../controllers/taskGroup.controller.js");

const router = express.Router();

router.get("/:projectId/groups", TaskGroupController.getGroupsByGroupBy)
router.post("/:projectId/groups", TaskGroupController.createNewGroup)
router.put("/:projectId/groups", TaskGroupController.updateGroupOrder)
router.delete("/:projectId/groups/:groupId", TaskGroupController.deleteTaskGroup)

module.exports = router;
