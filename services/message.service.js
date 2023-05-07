const { verifyObjectId } = require("../helpers/validate.helper");
const Message = require("../models/message.model");
const ChannelMember = require("../models/channelMember.model");
const PAGE_SIZE = 10;

async function createMessage(channelId, userId, description) {
  if (!verifyObjectId(channelId)) return;
  const message = new Message({
    channel: channelId,
    user: userId,
    description: description,
  });

  const members = await ChannelMember.find({
    channel: channelId,
    user: { $ne: userId },
  });
  console.log({members})
  await Promise.all([
    members.forEach(async (member) => {
      member.unReadMessages = member.unReadMessages + 1;
      await member.save();
    }),
  ]);

  await message.save();
  return message;
}

async function getMessagesPagination(channelId, page) {
  if (!verifyObjectId(channelId)) return;

  const comments = await Message.find({ channel: channelId })
    .populate({ path: "user" })
    .sort({ createdAt: "desc" })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE);

  return comments;
}

module.exports = { createMessage, getMessagesPagination };
