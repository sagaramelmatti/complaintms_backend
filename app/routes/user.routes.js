const { authJwt } = require("../middleware");
const users = require("../controllers/user.controller.js");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    }); 
    app.get("/api/test/all", users.allAccess); 
    
    app.get(
        "/api/test/user",
        [authJwt.verifyToken],
        users.userBoard
    ); 
    app.get(
        "/api/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        users.adminBoard
    );
    
    var router = require("express").Router();
  
    // Retrieve a single Tutorial with id
    router.get("/:id",  users.findOne);

    router.post("/", users.create);
  
    // Update a Tutorial with id
    router.put("/:id",  users.update);
  
    // Delete a Tutorial with id
    router.delete("/:id",  users.delete);
  
    app.use('/api/users', router);
};
