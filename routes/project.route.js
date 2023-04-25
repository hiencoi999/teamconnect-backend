const express = require("express");
const ProjectController = require("../controllers/project.controller.js");

const router = express.Router();

router.post("/", ProjectController.create);
router.get("/", ProjectController.getAll);
router.get("/deleted", ProjectController.getAllDeleted)
router.get("/:projectId", ProjectController.getOne);
router.put("/:projectId", ProjectController.updateName)
router.delete("/:projectId", ProjectController.delete);
router.post("/:projectId/invitation", ProjectController.sendInvitation);
router.get("/:projectId/members", ProjectController.getProjectMembers);

module.exports = router;
