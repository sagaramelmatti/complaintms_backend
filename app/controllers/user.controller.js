exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

const db = require("../models");
const Op = db.Sequelize.Op;
const User = db.users;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.paymentAmount) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a User
  const user = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    departmentId: req.body.departmentId,
  };

  // Save User in the database
  User.create(user)
    .then((data) => {
      const user = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        departmentId: req.body.departmentId,
      };

      User.update(user, {
        where: { id: req.body.userId },
      })
        .then((num) => {
          if (num == 1) {
            console.log("User Paid & Remainng Amount updated successfully.");

            var mailOptions = {
              from: 'sagarmelmatti@gmail.com',
              to: user.email,
              subject: 'Employee Registration',
              text: 'Employee registered succresfully', // plain text body
              html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear '+ capitalizeFirstLetter(employee_name) +' </b></span>, </br></br> <SPAN STYLE="font-size:13.0pt"> You have been registered succesfully </br> Admin will review ',
          
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            }); 

            var mailOptionsAdmin = {
              from: 'sagarmelmatti@gmail.com',
              to: 'sagarmelmatti@gmail.com',
              subject: 'Review New Employee',
              text: 'New Employee has been registered', // plain text body
              html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear Admin New employee has been registered kindly review ',
          
            };
            
            transporter.sendMail(mailOptionsAdmin, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            }); 


          } else {
            console.log(
              "Cannot update User with id=${req.body.studentId}. Maybe User was not found or req.body is empty!"
            );
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating User with id=" + req.body.studentId,
          });
        });

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};
