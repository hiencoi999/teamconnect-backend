const {
  createChannel,
  getChannelsByUserId,
  getChannelAndMember,
  readAllMessages,
} = require("../services/channel.service");
const {
  createChannelMember,
  removeChannelMember,
} = require("../services/channelMember.service");

class ChannelController {
  static async createChannel(req, res) {
    try {
      const channel = await createChannel(
        req.body.projectId,
        req.body.channelName,
        req.decoded.userId,
        false
      );
      if (!channel) res.status(400).json({ message: "bad request" });
      res.status(201).json({ message: "created" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getOneChannel(req, res) {
    try {
      const { channel, members } = await getChannelAndMember(
        req.params.channelId
      );
      if (!channel || !members)
        res.status(400).json({ message: "bad request" });
      res.status(200).json({ channel, members });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getChannels(req, res) {
    try {
      const channels = await getChannelsByUserId(req.decoded.userId);
      res.status(200).json({ channels });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getUploadUrlFromChannel(req, res) {
    try {
      const fileName = req.params.channelId + req.body.fileName;
      const url = await generateUploadURL(fileName);
      res.status(200).json({ url });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async addNewMember(req, res) {
    try {
      const member = await createChannelMember(
        req.params.channelId,
        req.body.userId
      );
      if (!member) res.status(400).json({ message: "bad request" });
      res.status(201).json({ message: "created" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async removeMember(req, res) {
    try {
      const removedMember = await removeChannelMember(
        req.params.channelId,
        req.decoded.userId
      );
      if (!removedMember) res.status(400).json({ message: "bad request" });
      res.status(200).json({ message: "deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async updateReadMessage(req, res) {
    try {
      const success = await readAllMessages(
        req.params.channelId,
        req.decoded.userId
      );
      if (!success) res.status(400).json({ message: "bad request" });
      res.status(200).json({ message: "updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = ChannelController;
