const db = require("../models");
const Complaint = db.complaints;
const Department = db.departments;
const User = db.user;
const Op = db.Sequelize.Op;

// Retrieve all Payments from the database.
exports.findAllComplaints = (req, res) => {
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

// Retrieve all Payments from the database.
exports.findAllUsers = (req, res) => {
  //User.findAll({ where: condition })
  User.findAll({
    include: [
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

// Update a Complaint by the id in the request
exports.updateComplaintStatus = (req, res) => {
  const id = req.params.id;
  // Create a Complaint
  const complaint = {
    status: req.body.status,
    comment: req.body.comment,
  };

  Complaint.update(complaint, {
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

// Update a Complaint by the id in the request
exports.updateUserStatus = (req, res) => {
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

// Delete a User with the specified id in the request
exports.deleteUser = (req, res) => {
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

// Delete a User with the specified id in the request
exports.deleteComplaint = (req, res) => {
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
