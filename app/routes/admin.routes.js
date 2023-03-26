const { authJwt } = require("../middleware");
const admin = require("../controllers/admin.controller.js");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var router = require("express").Router();

  // Retrieve all Tutorials
  router.get("/findAllComplaints/", admin.findAllComplaints);

  // Retrieve all Tutorials
  router.get("/findAllUsers/", admin.findAllUsers);

  // Delete User
  router.delete("/deleteUser/", admin.deleteUser);

  // Delete User
  router.delete("/deleteComplaint/", admin.deleteComplaint);

  // Update a Complaint with id
  router.put("/complaint/updateStatus/:id", admin.updateComplaintStatus);

  // Update a Complaint with id
  router.put("/user/updateStatus/:id", admin.updateUserStatus);

  app.use("/api/admin", router);
};
