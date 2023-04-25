const { verifyObjectId } = require("../helpers/validate.helper");
const ChannelMember = require("../models/channelMember.model");

async function createChannelMember(channelId, userId) {
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

module.exports = { createChannelMember, getChannelMemberByProjectId };
