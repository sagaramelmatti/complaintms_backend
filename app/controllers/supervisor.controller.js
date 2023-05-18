const db = require("../models");
const Complaint = db.complaints;
const Department = db.departments;
const Location = db.locations;
const User = db.user;
const Op = db.Sequelize.Op;
const pdf = require('html-pdf');
const pdfTemplate = require('../documents');
const nodemailer = require('nodemailer');
const sequelize = require("sequelize");
const email_config = require("../config/email.json");

var sender_email = email_config.sender_email;
var sender_password = email_config.sender_password;
var sender_host = email_config.host;
var sender_port = email_config.port;
var admin_email = email_config.admin_email;


// Retrieve all Payments from the database.
exports.findAllComplaints = (req, res) => {

const locationId = req.params.locationId;

  let condition = { locationId: { [Op.eq]: locationId }  };

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
exports.updateComplaintStatus = async (req, res) => {
  const id = req.params.id;
  // Create a Complaint
  const complaint = {
    status: req.body.status,
    comment: req.body.comment,
    complaint_resolved_date: new Date()
  };

  //try {
    const complaint_status = await Complaint.update(complaint, {
      where: { id: id },
    });

    const complaint_result = await Complaint.findByPk(req.params.id);
    const location_result = await Location.findByPk(complaint_result.locationId);
    const user_result = await User.findByPk(complaint_result.userId);

    Complaint.findByPk(id)
      .then((complaint_data) => {
        if (complaint_data) {

          const transporter = nodemailer.createTransport({
            host: sender_host,
            port: sender_port,
            auth: {
                user: sender_email,
                pass: sender_password,
            },
          });
          transporter.verify().then(console.log).catch(console.error);

          var usermailOptions = {
            from: sender_email,
            to: user_result.email,
            subject: 'Complaint Change Status',
            text: 'Complaint Change Status', // plain text body
            html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear ' + capitalizeFirstLetter(user_result.name) + ' </b></span>, </br></br> <SPAN STYLE="font-size:13.0pt"> Your Complaint status has been chnaged </br>' +
              '<p> Complaint details mentioned below : <p>' +
              ' Complaint Status: ' + complaint.status +
              ' <br>Comment : ' + complaint.comment + '',
          };

          transporter.sendMail(usermailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          var mailOptionsLocationHead = {
            from: sender_email,
            to: location_result.email,
            subject: 'Complaint Change Status',
            text: 'Complaint Change Status', // plain text body
            html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear ' + capitalizeFirstLetter(location_result.headName) + ' </b></span>, </br></br> <SPAN STYLE="font-size:13.0pt"> Complaint status has been changed for your location, </br> ' +
              '<p> Details mentioned below: <p>' +
              ' User Name: ' + user_result.name +
              ' <br> Email : ' + user_result.email +
              ' <br> Complaint In Short : ' + complaint_result.title +
              ' <br> Complaint Description: ' + complaint_result.description +
              ' <br> Complaint Status : ' + complaint.status +
              ' <br> Comment : ' + complaint.comment + '',
          };

          transporter.sendMail(mailOptionsLocationHead, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          res.send("Complaint Status successfully.");
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`,
          });
        }
      })

      /*
  } catch (error) {
    console.log('error');
    return 'test';
  }
  */

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
  const fromDate = req.query.from_date;
  const toDate = req.query.to_date;

  let condition = {};
  if (locationId) {
    condition = { locationId: locationId ? { [Op.like]: `%${locationId}%` } : null };
  }
  if (fromDate) {
    condition = { complaint_added_date: fromDate ? { [Op.gte]: `%${fromDate}%` } : null };
  }

  if (toDate) {
    condition = { complaint_added_date: toDate ? { [Op.lte]: `%${toDate}%` } : null };
  }

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

function capitalizeFirstLetter(str) {
  // converting first letter to uppercase
  const capitalized = str.replace(/^./, str[0].toUpperCase());
  return capitalized;
}