const db = require("../models");
const Op = db.Sequelize.Op;
const User = db.user;
const Location = db.locations;
const Department = db.departments;
//var User = require('../models/index').User;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
exports.supervisorBoard = (req, res) => {
  res.status(200).send("Supervisor Content.");
};


// Retrieve all Payments from the database.
exports.findAll = (req, res) => {

  const locationId = req.query.locationId;
  const userId = req.query.userId;
  const userType = 'U';
  /*
  console.log("location id"+locationId);

  const condition = [
    {
      //locationId: locationId ? { locationId: { [Op.like]: `%${locationId}%` } } : null,
      locationId: locationId != undefined ?  {   [Op.like]: `%${locationId}%` }  : null
    }
];
*/
  let condition = {};
  if (locationId) {
    condition = { locationId: locationId ? { [Op.like]: `%${locationId}%` } : null };
  }
  if (userId) {
    condition = { userId: userId ? { [Op.like]: `%${userId}%` } : null };
  }
  if (userType) {
    condition = { userType: userType ? { [Op.like]: `%${userType}%` } : null };
  }
  
  console.log("locatin id ="+locationId);

  User.findAll({
    where: condition,
    include: [
      {
        model: Department,
        as: "department",
        attributes: ["name"],
      },
      {
        model: Location,
        as: "location",
        attributes: ["name"],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving payments.",
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

// Update a User by the id in the request
exports.updateStatus = (req, res) => {
  const id = req.params.id;

  // Create a Complaint
  const user = {
    status: req.body.status
  };


  User.update(user, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User Status was updated successfully.",
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


