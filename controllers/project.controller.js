const { createChannel } = require("../services/channel.service");
const { createInvitation } = require("../services/invitation.service");
const {
  createProject,
  getProjectsByUserId,
  deleteProject,
  getProjectAndMembers,
  renameProject,
} = require("../services/project.service");
const {
  getProjectMemberByProjectId,
} = require("../services/projectMember.service");

class ProjectController {
  static async create(req, res) {
    try {
      const project = await createProject(
        req.body.projectName,
        req.body.projectDescription,
        req.decoded.userId
      );
      const channel = await createChannel(
        project._id,
        req.body.projectName,
        req.decoded.userId,
        true
      );
      res.status(200).json({
        message: "Created",
        project, channel
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const isDeleted = false;
      const projects = await getProjectsByUserId(req.decoded.userId, isDeleted);
      res.status(200).send({ data: projects });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getAllDeleted(req, res) {
    try {
      const isDeleted = true;
      const projects = await getProjectsByUserId(req.decoded.userId, isDeleted);
      res.status(200).send({ data: projects });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async restoreDeletedProject(req, res) {
    try {
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getOne(req, res) {
    try {
      const result = await getProjectAndMembers(req.params.projectId);
      if (!result) res.status(404).json({ message: "Not Found" });
      else
        res
          .status(200)
          .json({ project: result.project, members: result.members });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const deletedProject = await deleteProject(
        req.decoded.userId,
        req.params.projectId
      );
      if (deletedProject) {
        res.status(200).json({
          message: "Deleted",
        });
      } else
        res.status(403).json({
          message: "You do not have permission",
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async sendInvitation(req, res) {
    try {
      await createInvitation(
        req.decoded.userId,
        req.body.projectId,
        req.body.emails
      );

      res.status(201).json({ message: "Invitation sent" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getProjectMembers(req, res) {
    try {
      const members = await getProjectMemberByProjectId(req.params.projectId);
      if (members) res.status(200).json({ members });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async updateName(req, res) {
    try {
      const project = await renameProject(req.params.projectId, req.body.newName) 
      if(!project) res.status(400).json({message: 'bad request'})
      res.status(200).json({message: 'updated'})
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = ProjectController;
