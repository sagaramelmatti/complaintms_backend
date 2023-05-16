const db = require("../models");
const Op = db.Sequelize.Op;
const Department = db.departments;
const Location = db.locations;


// Create and Save a new Location
exports.create = (req, res) => {
  // Validating the request
    if (!req.body.name) {
      res.status(400).send({
        message: "Name can be placed here!"
      });
      return;
    }

  // Create a Department
  const department = {
    name: req.body.name,
    locationId: req.body.locationId
  };

  // Saving the Department in the database
  Department.create(department).then(data => {
      res.send("Department Added successfully.");
    }).catch(err => {
      res.status(500).send({
        Message:
          err.message || "Some errors will occur when creating a Department"
      });
    });
};

// Retrieve all Students from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Department.findAll({
    where: condition,
    include: [
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
          err.message || "Some error occurred while retrieving students.",
      });
    });
};

// Find a single Department with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Department.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Department with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Department with id=" + id,
      });
    });
};

// Update a Department by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Department.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Department was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Department with id=${id}. Maybe Department was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Department with id=" + id,
      });
    });
};

// Delete a Department with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Department.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Department was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Department with id=${id}. Maybe Department was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Department with id=" + id,
      });
    });
};

// Delete all Departments from the database.
exports.deleteAll = (req, res) => {
  Department.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Departments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all departments.",
      });
    });
};
