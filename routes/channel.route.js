const express = require("express");
const ChannelController = require("../controllers/channel.controller.js");
const MessageController = require("../controllers/message.controller.js")

const router = express.Router();

router.post("/", ChannelController.createChannel)
router.get("/", ChannelController.getChannels)
router.delete("/", ChannelController.deleteChannel)

router.post("/:channelId", ChannelController.getUploadUrlFromChannel)
router.get("/:channelId", ChannelController.getOneChannel)

router.post("/:channelId/messages", MessageController.createNewMessage)
router.get("/:channelId/messages", MessageController.getMessages)

module.exports = router;