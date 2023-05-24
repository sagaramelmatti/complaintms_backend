const { authJwt } = require("../middleware");
const location = require("../controllers/location.controller.js");

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
    router.get("/",  location.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id",  location.findOne);

    router.post("/", location.create);
  
    // Update a Tutorial with id
    router.put("/:id",  location.update);
  
    // Delete a Tutorial with id
    router.delete("/:id",  location.delete);
  
    app.use('/api/admin/locations', router);
  };