const { getInvitationByEmail, deleteInvitation, acceptInvitation } = require("../services/invitation.service");

class UserController {
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  static async getInvitationByEmail(req, res) {
    try {

      const invitations = await getInvitationByEmail(req.decoded.userId);

      res.status(200).json({ invitations });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async acceptInvitation(req, res) {
    try {
      const result = await acceptInvitation(
        req.decoded.userId,
        req.params.invitationId
      );
      if(result){

        res.status(200).json({ message: "accepted" });
      }
      else{
        res.status(401).json({message: "unauthorized for this action"})
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async deleteInvitation(req, res) {
    try {
      const deletedInv = await deleteInvitation(req.decoded.userId, req.params.invitationId);
      if (deletedInv) {
        res.status(200).json({ message: "deleted" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = UserController;
