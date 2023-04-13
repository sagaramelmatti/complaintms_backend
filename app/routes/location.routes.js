const { authJwt } = require("../middleware");
const locations = require("../controllers/location.controller.js");

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
    router.get("/",  locations.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id",  locations.findOne);

    router.post("/", locations.create);
  
    // Update a Tutorial with id
    router.put("/:id",  locations.update);
  
    // Delete a Tutorial with id
    router.delete("/:id",  locations.delete);
  
    app.use('/api/locations', router);
  };