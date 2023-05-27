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

    /* User API */

    // Retrieve all User
    router.get("/", user.findAll);

    // Retrieve all User
    router.get("/search/", user.searchUsers);

    // Retrieve Selected User
    router.get("/:id", user.findOne);

    // Retrieve all User
    router.put("/:id", user.update);

    // Delete a User with id
    router.delete("/:id", user.delete);

    // Update a Complaint with id
    router.put("/status/:id", user.updateStatus);

    app.use('/api/admin/users', router);
};
