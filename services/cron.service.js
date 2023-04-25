const cron = require("cron");
const { deletePermanentProjects } = require("./project.service");

function runCronJobs() {
  const job = new cron.CronJob({
    cronTime: "0 * * * * *", // Run job everyday
    onTick: async function () {
      await deletePermanentProjects();
    },
    start: true,
    timeZone: "Asia/Ho_Chi_Minh", 
  });

  job.start();
}

module.exports = { runCronJobs };
