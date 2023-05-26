const { authJwt } = require("../middleware");
const supervisor = require("../controllers/supervisor.controller.js");

module.exports = (app) => {

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var router = require("express").Router();

  /* Complaint API */

  // Retrieve all Complaint
  router.get("/:locationId", supervisor.findByLocationId);

  // Retrieve selected Complaint
  router.get("/:locationId/:id", supervisor.findComplaint);

  // Update Complaint
  router.put("/:id", supervisor.update);

  // Update a Complaint with id
  router.put("/status/:id", supervisor.updateStatus);

  app.use("/api/supervisor/complaints", router);
};
