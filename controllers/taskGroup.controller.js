const { getAllGroupByGroupBy, deleteGroup } = require("../services/taskGroup.service");
const {
  updateGroupOrder,
  createTaskGroup,
} = require("../services/taskGroup.service");
class TaskGroupController {
   
    static async getGroupsByGroupBy(req, res) {
        try {
            const groups = await getAllGroupByGroupBy(req.params.projectId, "STATUS")
            if(!groups) res.status(400).json({message: 'bad request'});
            res.status(200).json({groups})
        } catch (error) {
            console.log(error);
          res.status(500).json({
            message: error.message,
          });
        }
    }
    
      static async createNewGroup(req, res) {
        try {
          await createTaskGroup(req.params.projectId, req.body.name);
          res.status(201).json({ message: "created" });
        } catch (error) {
          console.log(error);
          res.status(500).json({
            message: error.message,
          });
        }
      }
    
      static async updateGroupOrder(req, res) {
        try {
          await updateGroupOrder(req.params.projectId, req.body.columns, req.body.groupBy);
          res.status(200).json({ message: "updated" });
        } catch (error) {
          console.log(error);
          res.status(500).json({
            message: error.message,
          });
        }
      }

      static async deleteTaskGroup(req, res) {
        try {
          const deletedGroup = await deleteGroup(req.params.groupId)
          if(!deletedGroup) res.status(400).json({message: 'bad request'})
          if(deletedGroup === "NOT_EMPTY") res.status(400).json({message: 'group is not empty'})
          res.status(200).json({message: 'deleted'})
        } catch (error) {
          console.log(error);
          res.status(500).json({
            message: error.message,
          });
        }
      }
}

module.exports = TaskGroupController