const { authJwt } = require("../middleware");
const admin = require("../controllers/admin.controller.js");
const user = require("../controllers/user.controller.js");
const complaint = require("../controllers/complaint.controller.js");
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

  /* User API */

  // Retrieve all User
  router.get("/users/", admin.findAllUser);

  // Retrieve Selected User
  router.get("/users/:id", admin.findUser);

  // Retrieve all User
  router.put("/users/:id", admin.updateUser);

  // Delete a User with id
  router.delete("/users/:id",  admin.deleteUser);

  
  /* Complaint API */

  // Retrieve all Complaint
  router.get("/complaints/", admin.findAllComplaints);

  // Retrieve selected Complaint
  router.get("/complaints/:id", admin.findComplaint);

  // Post Complaint
  router.post("/complaints/", admin.createComplaint);

  // Update Complaint
  router.put("/complaints/:id", admin.updateComplaint);

  // Delete a Complaint with id
  router.delete("/complaints/:id",  complaint.delete);

  // Update a Complaint with id
  router.put("/complaint/updateStatus/:id", admin.updateComplaintStatus);

  // Update a Complaint with id
  router.put("/user/updateStatus/:id", admin.updateUserStatus);

   // Retrieve all Complaint
   router.post("/reports/complaints/", admin.createComplaintReport);

   // Retrieve all Complaint
   router.get("/reports/complaints/", admin.fetchComplaintReport);

  app.use("/api/admin", router);

  /*
  cron.schedule("* 5 * * * *", () => {
    console.log("Running every minute");
  });
  */

};
