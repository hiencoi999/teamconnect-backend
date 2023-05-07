const { verifyObjectId } = require("../helpers/validate.helper");
const ChannelMember = require("../models/channelMember.model");
const Channel = require("../models/channel.model");
const Message = require("../models/message.model");

async function createChannelMember(channelId, userId) {
  if (!verifyObjectId(channelId) || !verifyObjectId(userId)) return;
  const existedMember = await ChannelMember.findOne({
    channel: channelId,
    user: userId,
  });
  if (existedMember) return;
  const newChannelMember = new ChannelMember({
    channel: channelId,
    user: userId,
  });
  await newChannelMember.save();
  return newChannelMember;
}

async function getChannelMemberByProjectId(channelId) {
  if (!verifyObjectId(channelId)) return;
  const members = await ChannelMember.find({ channel: channelId })
    .populate({ path: "user" })
    .exec();
  return members;
}

async function removeChannelMember(channelId, userId) {
  if (!verifyObjectId(channelId) || !verifyObjectId(userId)) return;
  const removedMember = await ChannelMember.deleteOne({
    channel: channelId,
    user: userId,
  });
  if (!removedMember) {
    return;
  } else {
    const numOfMembers = await ChannelMember.count({ channel: channelId });
    if (numOfMembers < 1) {
      await Channel.deleteOne({ _id: channelId });
      await Message.deleteMany({ channel: channelId });
    }
  }

  return removedMember;
}

module.exports = {
  createChannelMember,
  getChannelMemberByProjectId,
  removeChannelMember,
};
