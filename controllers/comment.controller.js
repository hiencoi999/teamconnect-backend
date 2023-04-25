const { createNewComment, getCommentsPagination, deleteOneComment, updateOneComment } = require("../services/comment.service");

class CommentController {
  static async createComment(req, res) {
    try {
      const comment = await createNewComment(
        req.params.taskId,
        req.decoded.userId,
        req.body.description
      );
      if(!comment) res.status(400).json({message: 'bad request'})
      res.status(201).json({message: 'created'})
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getComments(req, res) {
    try {
      const comments = await getCommentsPagination(req.params.taskId, req.query.page)
      res.status(200).json({comments})
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async updateComment(req, res) {
    try {
      const updatedComment = await updateOneComment(req.decoded.userId, req.params.commentId, req.body.description)
      if(!updatedComment) res.status(400).json({message: 'bad request'})
      res.status(200).json({message: 'updated'})
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async deleteComment(req, res) {
    try {
      const deletedComment = await deleteOneComment(req.decoded.userId, req.params.commentId)
      if(!deletedComment) res.status(400).json({message: 'bad request'})
      res.status(200).json({message: 'deleted'})
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

}

module.exports = CommentController;
