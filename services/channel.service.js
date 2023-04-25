const { verifyObjectId } = require("../helpers/validate.helper");
const Channel = require("../models/channel.model");
const ChannelMember = require("../models/channelMember.model");
const Message = require("../models/message.model");
const { createChannelMember } = require("./channelMember.service");
const { getProjectsByUserId } = require("./project.service");

async function createChannel(projectId, name, userId, isGlobal) {
  if (!name || !projectId) return;
  const channel = new Channel({
    name: name,
    project: projectId,
    isGlobal: isGlobal
  });
  await channel.save();
  await createChannelMember(channel._id, userId);
  return channel;
}

async function getChannelAndMember(channelId) {
  if (!verifyObjectId(channelId)) return;
  const channel = await Channel.findOne({ _id: channelId });
  if (!channel) return;
  const members = await ChannelMember.find({ channel: channelId })
    .populate({ path: "user" })
    .exec();
  if (!members) return;
  return { channel, members };
}

async function getChannelsByUserId(userId) {
  if (!verifyObjectId(userId)) return;
  const data = await ChannelMember.find({ user: userId })
    .populate({ path: "channel", match: { isDeleted: false } })
    .exec();
    const channelMembers = data.filter(member => member.channel !== null)
    console.log(channelMembers)
  if (!channelMembers.length) {
    return [];
  }
  channelMembers.sort(function (a, b) {
    if (a.channel.name < b.channel.name) {
      return -1;
    }
    if (a.channel.name > b.channel.name) {
      return 1;
    }
    return 0;
  });

  const projects = await getProjectsByUserId(userId, false)

  const channels = []

  projects.forEach(project => {
    const projectChannels = []
    channelMembers.forEach(member => {
      if(member.channel.project.equals(project.project._id)) {
        projectChannels.push({channel: member.channel})
      }
    })
    channels.push({project: project.project, channels: projectChannels})
  })
  return channels
}

async function deleteChannel(channelId) {
  if (!verifyObjectId(channelId)) return;
  const deletedChannel = await Channel.deleteOne({ _id: channelId });
  await Message.deleteMany({ channel: channelId });
  await ChannelMember.deleteMany({ channel: channelId });
  return deletedChannel;
}

module.exports = {
  createChannel,
  getChannelsByUserId,
  getChannelAndMember,
  deleteChannel,
};
