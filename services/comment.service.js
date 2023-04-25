const { verifyObjectId } = require("../helpers/validate.helper");
const Comment = require("../models/comment.model");

const PAGE_SIZE = 5

async function createNewComment(taskId, userId, description) {
  if (!verifyObjectId(taskId)) return;
  const newComment = new Comment({
    task: taskId,
    user: userId,
    description: description,
  });
  await newComment.save();
  return newComment;
}

async function getCommentsPagination(taskId, page) {
  if (!verifyObjectId(taskId)) return;

  const comments = await Comment.find({ task: taskId })
    .populate({ path: "user" })
    .sort({ createdAt: "desc" })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE);

  return comments;
}

async function updateOneComment(userId, commentId, description) {
  if (!verifyObjectId(commentId)) return;
  const updatedComment = await Comment.findOne({$and: [{ _id: commentId, user: userId }]});
  if (!updatedComment) return;
  updatedComment.description = description
  await updatedComment.save()
  return updatedComment
}

async function deleteOneComment(userId, commentId) {
  
  if (!verifyObjectId(commentId)) return;
  const comment = await Comment.findOne({$and: [{ _id: commentId, user: userId }]});
  if (!comment) return;
  const deletedComment = await Comment.deleteOne({ _id: commentId });
  return deletedComment;
}

module.exports = { createNewComment, getCommentsPagination, updateOneComment, deleteOneComment };
