const db = require("../models");
const Complaint = db.complaints;
const Department = db.departments;
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new Complaint
exports.create = (req, res) => {
  // Validate request
  if (!req.body.paymentAmount) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Complaint
  const complaint = {
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId,
    departmentId: req.body.departmentId,
  };

  // Save Complaint in the database
  Complaint.create(complaint)
    .then((data) => {
      const complaint = {
        title: req.body.title,
        description: req.body.description,
        userId: req.body.userId,
        departmentId: req.body.departmentId,
        status: "D",
      };

      Complaint.update(complaint, {
        where: { id: req.body.complaintId },
      })
        .then((num) => {
          if (num == 1) {
            console.log(
              "Complaint Paid & Remainng Amount updated successfully."
            );
          } else {
            console.log(
              "Cannot update Complaint with id=${req.body.complaintId}. Maybe Complaint was not found or req.body is empty!"
            );
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating Complaint with id=" + req.body.complaintId,
          });
        });

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Complaint.",
      });
    });
};

// Retrieve all Payments from the database.
exports.findAll = (req, res) => {
  //const rollNo = req.query.studentId;
  //var condition = studentId ? { studentId: { [Op.like]: `%${studentId}%` } } : null;

  //Complaint.findAll({ where: condition })
  Complaint.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["name"],
      },
      {
        model: Department,
        as: "department",
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

// Find a single Complaint with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Complaint.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Complaint with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Complaint with id=" + id,
      });
    });
};

// Update a Complaint by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Complaint.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Complaint was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Complaint with id=${id}. Maybe Complaint was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Complaint with id=" + id,
      });
    });
};

// Delete a Complaint with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Complaint.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Complaint was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Complaint with id=${id}. Maybe Complaint was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Complaint with id=" + id,
      });
    });
};

// Retrieve all Payments from the database.
exports.findByUserId = (req, res) => {
  const userId = req.params.userId;

  var condition = userId ? { userId: { [Op.like]: `%${userId}%` } } : null;

  Complaint.findAll({
    where: condition,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["name"],
      },
      {
        model: Department,
        as: "department",
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
