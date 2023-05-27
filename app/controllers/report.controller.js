const db = require("../models");
const Complaint = db.complaints;
const User = db.user;
const Location = db.locations;
const Op = db.Sequelize.Op;
const pdf = require('html-pdf');
const pdfTemplate = require('../documents');
const nodemailer = require('nodemailer');
const sequelize = require("sequelize");

// Retrieve all Payments from the database.
exports.create = async (req, res) => {

    const locationId = req.query.locationId;
    const fromDate = req.query.from_date;
    const toDate = req.query.to_date;

    console.log("locationId"+locationId);
    console.log("fromDate"+fromDate);
    console.log("toDate"+toDate);
  
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
