const { authJwt } = require("../middleware");
const admin = require("../controllers/admin.controller.js");
const supervisor = require("../controllers/supervisor.controller.js");
const complaint = require("../controllers/complaint.controller.js");

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
  router.get("/complaints/:locationId", supervisor.findComplaintByLocationId);

  // Retrieve selected Complaint
  router.get("/complaints/:id", supervisor.findComplaint);

  // Delete a Complaint with id
  router.delete("/complaints/:id",  complaint.delete);

  // Update a Complaint with id
  router.put("/complaint/updateStatus/:id", supervisor.updateComplaintStatus);

  app.use("/api/supervisor", router);
};
