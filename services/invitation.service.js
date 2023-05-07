const Invitation = require("../models/invitation.model");
const User = require("../models/user.model");
const ProjectMember = require("../models/projectMember.model");
const Channel = require("../models/channel.model");
const { createProjectMember } = require("./projectMember.service");
const { createChannelMember } = require("./channelMember.service");
const { verifyObjectId } = require("../helpers/validate.helper");

async function createInvitation(userId, projectId, emails) {
  const records = [];

  await Promise.all(
    emails.map(async (email) => {
      let isExist = await Invitation.count({ project: projectId, to: email });
      let isExistUser = await User.findOne({ email: email });
      let isProjectMember = await ProjectMember.count({
        project: projectId,
        user: isExistUser?._id,
        isDeleted: false
      });

      if (!isExist && !isProjectMember) {
        records.push({ project: projectId, from: userId, to: email });
      }
    })
  );

  await Invitation.insertMany(records);
}

async function getInvitationByEmail(userId) {
  const user = await User.findById(userId);
  const invitations = await Invitation.find({ to: user.email })
    .populate({ path: "project", select: "name" })
    .populate({ path: "from", select: "email picture" })
    .exec();

  return invitations;
}

async function acceptInvitation(userId, invitationId) {
  if (!verifyObjectId(invitationId)) return;
  const deletedItem = await deleteInvitation(userId, invitationId);
  if (!deletedItem) return;
  const channel = await Channel.findOne({ project: deletedItem.project });
  await createChannelMember(channel._id, userId);
  return await createProjectMember(deletedItem.project, userId, "MEMBER");
}

async function deleteInvitation(userId, invitationId) {
  let user = await User.findById(userId);

  if (!user) return false;

  let isExist = await Invitation.count({ _id: invitationId, to: user.email });

  if (isExist) {
    const deletedItem = await Invitation.findOneAndDelete({
      _id: invitationId,
    });
    return deletedItem;
  }

  return false;
}

module.exports = {
  createInvitation,
  getInvitationByEmail,
  acceptInvitation,
  deleteInvitation,
};
