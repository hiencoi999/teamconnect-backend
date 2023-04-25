const {
  createMessage,
  getMessagesPagination,
} = require("../services/message.service");

class MessageController {
  static async getMessages(req, res) {
    try {
      const messages = await getMessagesPagination(
        req.params.channelId,
        req.query.page
      );
      res.status(200).json({ messages });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async createNewMessage(req, res) {
    try {
      const message = await createMessage(
        req.params.channelId,
        req.decoded.userId,
        req.body.description
      );
      if (!message) res.status(400).json({ message: "bad request" });
      res.status(201).json({ message: "created" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = MessageController;
