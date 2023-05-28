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

    const locationId = req.query.locationId;
    const userId = req.query.userId;
	const status = req.query.status;
    //var condition = locationId ? { locationId: { [Op.like]: `%${locationId}%` } } : null;

    let condition = {};
    if (locationId) {
        condition = { locationId: locationId ? { [Op.like]: `%${locationId}%` } : null };
    }
    if (userId) {
        condition = { userId: userId ? { [Op.like]: `%${userId}%` } : null };
    }
	 if (status) {
        condition = { status: status ? { [Op.like]: `%${status}%` } : null };
    }
	

    Complaint.findAll({
        where: condition,
        attributes: [
            "id",
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
                model: User,
                as: "user",
                attributes: ["id"],
            },
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

// Create and Save a new Complaint
exports.create = (req, res) => {
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

// Delete a User with the specified id in the request
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

// Update a Complaint by the id in the request
exports.updateStatus = async (req, res) => {

    const date = require('date-and-time');

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
    const department_result = await Location.findByPk(complaint_result.departmentId);
    const user_result = await User.findByPk(complaint_result.userId);

    Complaint.findByPk(id)
        .then((complaint_data) => {
            if (complaint_data) {

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

                var usermailOptions = {
                    from: sender_email,
                    to: user_result.email,
                    subject: 'Complaint Change Status',
                    text: 'Complaint Change Status', // plain text body
                    html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear ' + capitalizeFirstLetter(user_result.name) + ' </b></span>, </br> </br>' +
                        '<p> Kindly check complaint details mentioned below : <p>' +
                        ' Complaint Status: ' + complaint_data.status +
                        ' <br>Comment : ' + complaint_data.comment +
                        ' <br>Location : ' + location_result.name +
                        ' <br>Department : ' + department_result.name +
                        ' <br> Complaint Date : ' + date.format(complaint_data.complaint_added_date, 'DD-MM-YYYY HH:mm:ss') +
                        ' <br> Resolved Date : ' + date.format(complaint_data.complaint_resolved_date, 'DD-MM-YYYY HH:mm:ss') + '',
                }

                transporter.sendMail(usermailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                var mailOptionsIncharge = {
                    from: sender_email,
                    to: location_result.email,
                    subject: 'Complaint Change Status',
                    text: 'Complaint Change Status', // plain text body
                    html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear ' + capitalizeFirstLetter(location_result.headName) + ' </b></span>, </br></br> <SPAN STYLE="font-size:13.0pt"> Complaint status has been changed , </br> ' +
                        '<p> Details mentioned below: <p>' +
                        ' User Name: ' + user_result.name +
                        ' <br> Email : ' + user_result.email +
                        ' <br> Subject : ' + complaint_data.title +
                        ' <br> Description: ' + complaint_data.description +
                        ' <br> Status : ' + complaint_data.status +
                        ' <br> Comment : ' + complaint_data.comment +
                        ' <br> Complaint Date : ' + date.format(complaint_data.complaint_added_date, 'DD-MM-YYYY HH:mm:ss') +
                        ' <br> Resolved Date : ' + date.format(complaint_data.complaint_resolved_date, 'DD-MM-YYYY HH:mm:ss') +
                        ' <br> Ticket Number : ' + complaint_data.ticketNumberSequance + '',

                };

                transporter.sendMail(mailOptionsIncharge, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Admin Email sent: ' + info.response);
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

function capitalizeFirstLetter(str) {
    // converting first letter to uppercase
    const capitalized = str.replace(/^./, str[0].toUpperCase());
    return capitalized;
}