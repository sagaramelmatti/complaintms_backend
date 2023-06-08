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
  router.get("/complaints/:locationId", supervisor.findByLocationId);

  // Retrieve all Complaint
  router.get("/locations/:userId", supervisor.findByUserId);

  // Retrieve selected Complaint
  router.get("/complaints/:locationId/:id", supervisor.findComplaint);

  // Update Complaint
  router.put("/complaints/:id", supervisor.update);

  // Update a Complaint with id
  router.put("/complaints/status/:id", supervisor.updateStatus);

  // Delete a Complaint with id
  router.delete("/complaints/:id",  supervisor.delete);

  app.use("/api/supervisor", router);
};
