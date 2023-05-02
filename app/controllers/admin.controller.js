const db = require("../models");
const Complaint = db.complaints;
const Department = db.departments;
const Location = db.locations;
const User = db.user;
const Op = db.Sequelize.Op;
const pdf = require('html-pdf');
const pdfTemplate = require('../documents');
const sequelize = require("sequelize");

// Retrieve all Payments from the database.
exports.findAllUser = (req, res) => {

  const locationId = req.query.locationId;
  const userId = req.query.userId;
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


  //var condition = locationId ? { locationId: { [Op.like]: `%${locationId}%` } } : null;

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
exports.findUser = (req, res) => {
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


// Update a User by the id in the request
exports.updateUser = (req, res) => {
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


// Retrieve all Payments from the database.
exports.findAllComplaints = (req, res) => {

  const locationId = req.query.locationId;
  const userId = req.query.userId;
  //var condition = locationId ? { locationId: { [Op.like]: `%${locationId}%` } } : null;

  let condition = {};
  if (locationId) {
    condition = { locationId: locationId ? { [Op.like]: `%${locationId}%` } : null };
  }
  if (userId) {
    condition = { userId: userId ? { [Op.like]: `%${userId}%` } : null };
  }

  Complaint.findAll({
    where: condition,
    attributes: [
      "id",
      "title",
      "description",
      "status",
      "comment",
      [sequelize.fn('date_format', sequelize.col('complaint_added_date'), '%Y-%m-%d %H:%i'), 'complaint_added_date'],
      [sequelize.fn('date_format', sequelize.col('complaint_resolved_date'), '%Y-%m-%d %H:%i'), 'complaint_resolved_date'],
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
    /*
    attributes: [
      
      
    ]
    */
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
exports.findComplaint = (req, res) => {
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

// Retrieve all Payments from the database.
exports.findComplaintByUserId = (req, res) => {
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

// Update a Complaint by the id in the request
exports.updateComplaintStatus = (req, res) => {
  const id = req.params.id;
  // Create a Complaint
  const complaint = {
    status: req.body.status,
    comment: req.body.comment,
    complaint_resolved_date: new Date()
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



// Create and Save a new Complaint
exports.createComplaint = (req, res) => {
  // Validating the request
  if (!req.body.title) {
    res.status(400).send({
      message: "Title can be placed here!"
    });
    return;
  }

  // Creating a Tutorial
  const complaint = {
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId,
    departmentId: req.body.departmentId,
    status: req.body.status,
    complaint_added_date: new Date()
  };

  // Saving the Tutorial in the database
  Complaint.create(complaint).then(data => {
    res.send("Complaint Added successfully.");
  }).catch(err => {
    res.status(500).send({
      Message:
        err.message || "Some errors will occur when creating a tutorial"
    });
  });
};


// Update a Complaint by the id in the request
exports.updateComplaint = (req, res) => {
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

// Retrieve all Payments from the database.
exports.createComplaintReport = async (req, res) => {

  const locationId = req.query.locationId;
  const userId = req.query.userId;
  //var condition = locationId ? { locationId: { [Op.like]: `%${locationId}%` } } : null;

  let condition = {};
  /*
  if (locationId) {
    condition = { locationId: locationId ? { [Op.like]: `%${locationId}%` } : null };
  }
  if (userId) {
    condition = { userId: userId ? { [Op.like]: `%${userId}%` } : null };
  }
  */

  const complaint_list = await Complaint.findAll({
    where: condition,
    attributes: [
      "id",
      "title",
      "description",
      "status",
      "comment",
      [sequelize.fn('date_format', sequelize.col('complaint_added_date'), '%Y-%m-%d %H:%i'), 'complaint_added_date'],
      [sequelize.fn('date_format', sequelize.col('complaint_resolved_date'), '%Y-%m-%d %H:%i'), 'complaint_resolved_date'],
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
  });

  if(complaint_list){
    //console.log("complaint_added_date="+complaint_list[0].complaint_added_date);
    pdf.create(pdfTemplate(complaint_list), {}).toFile(`${__dirname}/result.pdf`, (err) => {
      if(err) {
        res.send(Promise.reject());
    }

    res.send(Promise.resolve());
  });
  } else {
    res.status(404).send({
      message: `Cannot find Complaint with id=${id}.`,
    });
  }

};



// Retrieve all Students from the database.
exports.fetchComplaintReport = (req, res) => {
  res.sendFile(`${__dirname}/result.pdf`)
};