const { authJwt } = require("../middleware");
const adminComplaint = require("../controllers/adminComplaint.controller.js");

module.exports = app => {
    
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    var router = require("express").Router();

  /* Complaint API */

  // Retrieve all Complaint
  router.get("/", adminComplaint.findAll);

   // Retrieve a single Tutorial with id
   router.get("/:id", adminComplaint.findOne);

  // Post Complaint
  router.post("/", adminComplaint.create);

  // Update Complaint
  router.put("/:id", adminComplaint.update);

  // Delete a Complaint with id
  router.delete("/:id",  adminComplaint.delete);

  // Update a Complaint with id
  router.put("/status/:id", adminComplaint.updateStatus);

  app.use('/api/admin/complaints', router);

};