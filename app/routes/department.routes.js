const { authJwt } = require("../middleware");
const department = require("../controllers/department.controller.js");

module.exports = app => {

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var router = require("express").Router();

  // Create a new Tutorial
  // Retrieve all Tutorials
  router.get("/", department.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", department.findOne);

  router.post("/", department.create);

  // Update a Tutorial with id
  router.put("/:id", department.update);

  // Delete a Tutorial with id
  router.delete("/:id", department.delete);

  // Delete all Tutorials
  router.delete("/", department.deleteAll);

  app.use('/api/admin/departments', router);
};