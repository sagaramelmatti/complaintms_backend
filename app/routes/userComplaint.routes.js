const { authJwt } = require("../middleware");
const user = require("../controllers/user.controller.js");
const userComplaint = require("../controllers/userComplaint.controller.js");

module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    }); 

    app.get(
        "/api/test/user",
        [authJwt.verifyToken],
        user.userBoard
    ); 
    app.get(
        "/api/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        user.adminBoard
    );
    
    var router = require("express").Router();

    // Retrieve a single Tutorial with id
    router.get("/:userId", userComplaint.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/id/:id", userComplaint.findOne);

    router.post("/", userComplaint.create);
  
    // Update a Tutorial with id
    router.put("/:id", userComplaint.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", userComplaint.delete);

    app.use('/api/user/complaints', router);
};
