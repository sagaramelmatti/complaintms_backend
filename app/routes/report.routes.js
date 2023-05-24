const { authJwt } = require("../middleware");
const report = require("../controllers/report.controller.js");
const cron = require("node-cron");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var router = require("express").Router();

   // Retrieve all Complaint
   router.post("/complaints", report.create);

  app.use("/api/admin/reports", router);

  /*
  cron.schedule("* 5 * * * *", () => {
    console.log("Running every minute");
  });
  */

};
