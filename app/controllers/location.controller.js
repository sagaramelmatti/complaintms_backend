const db = require("../models");
const Op = db.Sequelize.Op;
const Location = db.locations;
const User = db.user;
const LocationUsers = db.locationUsers;

// Create and Save a new Location

exports.create = (req, res) => {
  // Validating the request
    if (!req.body.name) {
      res.status(400).send({
        message: "Name can be placed here!"
      });
      return;
    }

    // Creating a Location
    const location = {
        name: req.body.name
    };

  // Saving the Location in the database
    Location.create(location).then(data => {
      res.send("Location Added successfully.");
    }).catch(err => {
      res.status(500).send({
        Message:
          err.message || "Some errors will occur when creating a Location"
      });
    });
};

// Retrieve all Students from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Location.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving students.",
      });
    });
};

// Retrieve all Students from the database.
exports.findAllLocationUser = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  LocationUsers.findAll({
    where: condition,
    attributes: [
      "id", 
      "userId", 
      "locationId"
    ],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["email"],
      },
      {
        model: Location,
        as: "location",
        attributes: ["name"],
      }

    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving students.",
      });
    });
};

// Find a single Location with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Location.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Location with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Location with id=" + id,
      });
    });
};

// Update a Location by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Location.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Location was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Location with id=${id}. Maybe Location was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Location with id=" + id,
      });
    });
};

// Delete a Location with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Location.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Location was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Location with id=${id}. Maybe Location was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Location with id=" + id,
      });
    });
};
