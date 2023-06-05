const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
      });

    app.post("/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted],
        controller.signup);
		
    app.post("/api/auth/signin", controller.signin);
	
	// Update a Tutorial with id
    app.put("/api/auth/changePassword/:id",  controller.changePassword);

    // Update a Tutorial with id
    app.post("/api/auth/forgotPassword",  controller.forgotPassword);
	
};