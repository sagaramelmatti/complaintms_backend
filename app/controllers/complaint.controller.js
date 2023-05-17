const db = require("../models");
const Complaint = db.complaints;
const Location = db.locations;
const User = db.user;
const Department = db.departments;
const Op = db.Sequelize.Op;
const nodemailer = require('nodemailer');
const user = require("../controllers/user.controller.js");
const email_config = require("../config/email.json");

var sender_email = email_config.sender_email;
var sender_password = email_config.sender_password;
var sender_host = email_config.host;
var sender_port = email_config.port;
var admin_email = email_config.admin_email;

// Create and Save a new Complaint
exports.create = async (req, res) => {
  // Validating the request
  if (!req.body.title) {
    res.status(400).send({
      message: "Title can be placed here!"
    });
    return;
  }

  // Creating a Tutorial
  let complaint = {
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId,
    locationId: req.body.locationId,
    status: req.body.status,
    complaint_added_date: new Date(),
    ticketNumber: Math.floor(Math.random() * 90000) + 10000
  };

  try {
    const complaint_result = await Complaint.create(complaint);
    const location_result = await Location.findByPk(complaint.locationId);

    const id = complaint.userId;
    User.findByPk(id)
      .then((user_data) => {
        if (user_data) {
          
          const transporter = nodemailer.createTransport({
            host: sender_host,
            port: sender_port,
            auth: {
                user: sender_email,
                pass: sender_password,
            },
          });
          transporter.verify().then(console.log).catch(console.error);

          var mailOptions = {
            from: sender_email,
            to: user_data.email,
            subject: 'New Complaint Added',
            text: 'New Complaint Added', // plain text body
            html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear ' + capitalizeFirstLetter(user_data.name) + ' </b></span>,  <SPAN STYLE="font-size:13.0pt"> </br>your Complaint has been registered, </br> Your complaint will be processed by confirm person  '+
            ' <br> Kindly keep Ticket Numbet for future referance : ' + complaint_result.ticketNumber + '',

          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          var mailOptionsAdmin = {
            from: sender_email,
            to: admin_email,
            subject: 'Review New Complaint',
            text: 'New Complaint has been registered', // plain text body
            html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear Admin New complaint has been posted, </br> Kindly review / forward it to concern person' +

              '<p> Complaint details mentioned below : <p>' +
              ' User Name: ' + user_data.name +
              ' <br> Email : ' + user_data.email +
              ' <br> Ticket Number : ' + complaint_result.ticketNumber +
              ' <br> Location : ' + location_result.name +
              ' <br> Subject : ' + complaint_result.title +
              ' <br> Description: ' + complaint_result.description + '',

          };

          transporter.sendMail(mailOptionsAdmin, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          var mailOptionsLocationHead = {
            from: sender_email,
            to: location_result.email,
            subject: 'New Complaint Registered For your location',
            text: 'New Complaint Added', // plain text body
            html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear ' + capitalizeFirstLetter(location_result.headName) + ' </b></span>, </br></br> <SPAN STYLE="font-size:13.0pt"> New Complaint has been registered for your location, </br> Kindly review ' +
              '<p> Details mentioned below: <p>' +
              ' User Name: ' + user_data.name +
              ' <br> Email : ' + user_data.email +
              ' <br> Location : ' + location_result.name +
              ' <br> Subject : ' + complaint_result.title +
              ' <br> Description : ' + complaint_result.ticketNumber +
              ' <br> Ticket Number : ' + complaint_result.ticketNumber + '',
          };

          transporter.sendMail(mailOptionsLocationHead, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          res.send("Complaint Added successfully.");
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`,
          });
        }
      })

    return complaint_result;
  } catch (error) {
    console.log('error');
    return 'test';
  }
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

function capitalizeFirstLetter(str) {
  // converting first letter to uppercase
  const capitalized = str.replace(/^./, str[0].toUpperCase());
  return capitalized;
}