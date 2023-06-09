const https = require('https');
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();

/*
const options = {
  key: fs.readFileSync('./localhost-key.pem'), // Replace with the path to your key
  cert: fs.readFileSync('./localhost.pem') // Replace with the path to your certificate
}
*/




var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  //res.json({ message: "Welcome to Schhol Fees Management application." });
});

require('./app/routes/adminComplaint.routes')(app);
require('./app/routes/auth.routes')(app);
require("./app/routes/department.routes")(app);
require("./app/routes/location.routes")(app);
require('./app/routes/report.routes')(app);
require('./app/routes/user.routes')(app);
require("./app/routes/supervisor.routes")(app);
require("./app/routes/userComplaint.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8081;
/*
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
*/


  const server = https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
      passphrase: "password",
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Secure server listening on port:${PORT}`);
  });


function initial() {
  Role.create({
    id: 1,
    name: "user"
  });  
  Role.create({
    id: 2,
    name: "admin"
  });
}
