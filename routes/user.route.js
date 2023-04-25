const express = require("express");
const UserController = require("../controllers/user.controller.js");

const router = express.Router();

router.get("/invitation", UserController.getInvitationByEmail);
router.post("/invitation/:invitationId", UserController.acceptInvitation);
router.delete("/invitation/:invitationId", UserController.deleteInvitation);

module.exports = router;
