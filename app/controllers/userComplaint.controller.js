const db = require("../models");
const Complaint = db.complaints;
const Location = db.locations;
const User = db.user;
const Department = db.departments;
const Op = db.Sequelize.Op;
const sequelize = require("sequelize");
const nodemailer = require('nodemailer');
const user = require("../controllers/user.controller.js");
const email_config = require("../config/email.json");

var sender_email = email_config.sender_email;
var sender_password = email_config.sender_password;
var sender_host = email_config.host;
var sender_port = email_config.port;
var admin_email = email_config.admin_email;


// Retrieve all Payments from the database.
exports.findAll = (req, res) => {

  const userId = req.params.userId;
  var condition = userId ? { userId: { [Op.like]: `%${userId}%` } } : null;

  Complaint.findAll({
    where: condition,
    attributes: [
      "id",
	  "userId",
      "ticketNumber",
      "ticketNumberSequance",
      "title",
      "description",
      "status",
      "comment",
      [sequelize.fn('date_format', sequelize.col('complaint_added_date'), '%d-%m-%Y %H:%i'), 'complaint_added_date'],
      [sequelize.fn('date_format', sequelize.col('complaint_resolved_date'), '%d-%m-%Y %H:%i'), 'complaint_resolved_date'],
    ],

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
          err.message || "Some error occurred while retrieving payments.",
      });
    });
};


// Find a single Complaint with an id
exports.findOne = (req, res) => {

  const date = require('date-and-time');
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


// Create and Save a new Complaint
exports.create = async (req, res) => {

  const date = require('date-and-time');

  // Validating the request
  if (!req.body.title) {
    res.status(400).send({
      message: "Title can be placed here!"
    });
    return;
  }

  let max = await Complaint.max('ticketNumber');
  if (max == null || max == undefined) {
    max = 0;
  }
  const max_value = parseInt(max) + 1;

  // Creating a Tutorial
  let complaint = {
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId,
    locationId: req.body.locationId,
    status: req.body.status,
    complaint_added_date: new Date(),
    ticketNumber: max_value,
    ticketNumberSequance: "0000" + max_value
  };

  try {

    const complaint_result = await Complaint.create(complaint);
    const location_result = await Location.findByPk(complaint.locationId);

    const id = complaint.userId;
    User.findByPk(id)
      .then((user_data) => {
        if (user_data) {

          const transporter = nodemailer.createTransport({
            service: 'gmail',
                    host: sender_host,
                    port: sender_port,
                    secure: false,
                    ignoreTLS:true,
                    requireTLS:false,
            auth: {
              user: sender_email,
              pass: sender_password,
            },
          });
          transporter.verify().then(console.log).catch(console.error);

          var mailOptions = {
            from: sender_email,
            to: user_data.email,
            subject: 'New Complaint Registered',
            text: 'New Complaint Added', // plain text body
            html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear ' + capitalizeFirstLetter(user_data.name) + ' </b></span>,<br/>  <SPAN STYLE="font-size:13.0pt"> </br>Your complaint has been registered succesfully and will be resolved by the concerned incharge after reviewed by the admin.  ' +
              ' <br/><br/> Kindly keep the ticket Number for future refference : ' + complaint_result.ticketNumberSequance + '',

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
            html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear Admin </b> New complaint has been posted, </br> Kindly review / forward it to concern person' +

              '<p> Complaint details mentioned below : <p>' +
              ' User Name: ' + user_data.name +
              ' <br> Email : ' + user_data.email +
              ' <br> Ticket Number : ' + complaint_result.ticketNumberSequance +
              ' <br> Location : ' + location_result.name +
              ' <br> Subject : ' + complaint_result.title +
              ' <br> Description: ' + complaint_result.description +
              ' <br> Complaint Date : ' + date.format(complaint_result.complaint_added_date, 'DD-MM-YYYY HH:mm:ss') + '',

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
              ' <br> Description : ' + complaint_result.description +
              ' <br> Ticket Number : ' + complaint_result.ticketNumberSequance +
              ' <br> Complaint Date : ' + date.format(complaint_result.complaint_added_date, 'DD-MM-YYYY HH:mm:ss') + '',
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


function capitalizeFirstLetter(str) {
  // converting first letter to uppercase
  const capitalized = str.replace(/^./, str[0].toUpperCase());
  return capitalized;
}


function getFormattedDate(date) {

  let today = new Date();
  let dd = today.getDate();

  let mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }
  today = `${mm}-${dd}-${yyyy}`;
  console.log(today);
  today = `${mm}/${dd}/${yyyy}`;
  console.log(today);
  today = `${dd}-${mm}-${yyyy}`;
  console.log(today);
  today = `${dd}/${mm}/${yyyy}`;
  console.log(today);

  return today;
}