const { createChannel, getChannelsByUserId, getChannelAndMember } = require("../services/channel.service");

class ChannelController {
  static async createChannel(req, res) {
    try {
      const channel = await createChannel(req.body.projectId, req.body.channelName, req.decoded.userId, false);
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
      const {channel, members} = await getChannelAndMember(req.params.channelId)
      console.log({channel, members})
      if(!channel || !members) res.status(400).json({ message: "bad request" });
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
      const channels = await getChannelsByUserId(req.decoded.userId)
      res.status(200).json({channels})
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async deleteChannel(req, res) {
    try {
      
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

}

module.exports = ChannelController;
