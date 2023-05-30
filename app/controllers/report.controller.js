const db = require("../models");
const Complaint = db.complaints;
const User = db.user;
const Location = db.locations;
const Department = db.departments;
const Op = db.Sequelize.Op;
const pdf = require('html-pdf');
const pdfTemplate = require('../documents');
const nodemailer = require('nodemailer');
const sequelize = require("sequelize");
const cron = require("node-cron");

const email_config = require("../config/email.json");

var sender_email = email_config.sender_email;
var sender_password = email_config.sender_password;
var sender_host = email_config.host;
var sender_port = email_config.port;
var admin_email = email_config.admin_email;

// Retrieve all Payments from the database.
exports.create = async (req, res) => {

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
      where: {
        locationId : locationId ? { [Op.like]: `%${locationId}%` } : null,
        complaint_added_date : sequelize.fn('complaint_added_date') ? { [Op.gte]: `%${fromDate}%` } : null
        //complaint_added_date : sequelize.fn('complaint_added_date') ? { [Op.lte]: `%${toDate}%` } : null,
      },

      where: {

        locationId : locationId ? { [Op.like]: `%${locationId}%` } : null,
        complaint_added_date: {
          [Op.gte]: date.format(fromDate, 'YYYY-MM-DD')
        },
        complaint_added_date: {
          [Op.lte]: date.format(toDate, 'YYYY-MM-DD')
        },
        //complaint_added_date : sequelize.fn('complaint_added_date') ? { [Op.lte]: `%${date.format(d, 'YYYY-MM-DD')}%` } : null
        //complaint_added_date : sequelize.fn('complaint_added_date') ? { [Op.lte]: `%${toDate}%` } : null,
      },

      attributes: [
        "id",
        "title",
        "description",
        "status",
        "comment",
        "ticketNumberSequance",
        [sequelize.fn('date_format', sequelize.col('complaint_added_date'), '%d-%m-%Y %H:%i'), 'complaint_added_date'],
        [sequelize.fn('date_format', sequelize.col('complaint_resolved_date'), '%d-%m-%Y %H:%i'), 'complaint_resolved_date'],
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
        {
          model: Department,
          as: "department",
          attributes: ["name"],
        },
      ],
    });


    //console.log(complaint_list);
    
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


async function complaintNotification ()  {
  
  const date = require('date-and-time');
  var d = new Date(); // today!
  var x = 3; // go back 5 days!
  d.setDate(d.getDate() - x);

  console.log("date"+date.format(d, 'YYYY-MM-DD'));

  let condition = {};

  const complaint_list = await Complaint.findAll({
    where: {

      status : 'New Complaint',
      complaint_added_date: {
        [Op.lte]: date.format(d, 'YYYY-MM-DD')
      }
      //complaint_added_date : sequelize.fn('complaint_added_date') ? { [Op.lte]: `%${date.format(d, 'YYYY-MM-DD')}%` } : null
      //complaint_added_date : sequelize.fn('complaint_added_date') ? { [Op.lte]: `%${toDate}%` } : null,
    },
    attributes: [
      "id",
      "title",
      "description",
      "status",
      "comment",
      "ticketNumberSequance",
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
      {
        model: Department,
        as: "department",
        attributes: ["name"],
      },
    ],
  });

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

  let message = (
    '<table border="1>' +
    '<thead>' +
    '<tr> Complaint Date </th>' +
    '<th> Ticket Number </th>'  +
    '<th> Location </th>'  +
    '<th> Department </th>'  +
    '<th> Subject </th>'  +
    '<th> Description </th>'  +
    /*...*/
    '</thead>'
  ); 
  
  for (let i = 0; i < complaint_list.length; i++) {
     message += (
       '<tr>' +
        '<td>' + complaint_list[i].complaint_added_date   + '</td>' +
        '<td>' + complaint_list[i].ticketNumberSequance + '</td>' +
        '<td>' + complaint_list[i].location.name + '</td>' +
        '<td>' + complaint_list[i].department.name + '</td>' +
        '<td>' + complaint_list[i].title + '</td>' +
        '<td>' + complaint_list[i].description + '</td>' +
        /*...*/
      '</tr>'
     );
  }
  
  message +=  '</table>';

  var usermailOptions = {
      from: sender_email,
      to: admin_email,
      subject: 'Pending Complaint Status Notification',
      text: 'Complaint Change Status', // plain text body
      'html': message
  }

  transporter.sendMail(usermailOptions, function (error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
  });

}

cron.schedule("0 0 10 * * 5", () => {
  console.log("scheduer call in controller each minute");
  complaintNotification();
});
