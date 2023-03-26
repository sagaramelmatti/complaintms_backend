const { authJwt } = require("../middleware");
const complaints = require("../controllers/complaint.controller.js");

module.exports = app => {
    
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    // Retrieve all Tutorials
    router.get("/", complaints.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", complaints.findOne);

    router.post("/", complaints.create);
  
    // Update a Tutorial with id
    router.put("/:id", complaints.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", complaints.delete);
  
    // Retrieve all Tutorials
    router.get("/findByUserId/:userId", complaints.findByUserId);

    app.use('/api/complaints', router);
  };