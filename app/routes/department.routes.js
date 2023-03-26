const { authJwt } = require("../middleware");
const departments = require("../controllers/department.controller.js");

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
    router.get("/",  departments.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id",  departments.findOne);

    router.post("/", departments.create);
  
    // Update a Tutorial with id
    router.put("/:id",  departments.update);
  
    // Delete a Tutorial with id
    router.delete("/:id",  departments.delete);
  
    // Delete all Tutorials
    router.delete("/",  departments.deleteAll);
  
    app.use('/api/departments', router);
  };