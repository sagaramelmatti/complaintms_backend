const { authJwt } = require("../middleware");
const user = require("../controllers/user.controller.js");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    }); 

    app.get("/api/test/all", user.allAccess); 
    
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

     // Retrieve Selected User
    router.get("/:id", user.findOne);
    
    // Update a Tutorial with id
    router.put("/:id",  user.update);

    app.use('/api/users', router);
};
