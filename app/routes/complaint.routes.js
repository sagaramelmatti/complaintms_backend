const { authJwt } = require("../middleware");
const complaint = require("../controllers/complaint.controller.js");

module.exports = app => {
    
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    var router = require("express").Router();
  
    // Retrieve a single Tutorial with id
    router.get("/:id", complaint.findOne);

    router.post("/", complaint.create);
  
    // Update a Tutorial with id
    router.put("/:id", complaint.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", complaint.delete);
  
    app.use('/api/complaints', router);
  };