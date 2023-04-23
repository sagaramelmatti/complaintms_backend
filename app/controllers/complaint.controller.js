const db = require("../models");
const Complaint = db.complaints;
const Location = db.locations;
const User = db.user;
const Department = db.departments;
const Op = db.Sequelize.Op;
const nodemailer = require('nodemailer');
const user = require("../controllers/user.controller.js");

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
    departmentId: req.body.departmentId,
    locationId: req.body.locationId,
    status: req.body.status
  };

  try {
    const complaint_result = await Complaint.create(complaint);

    const location_result = await Location.findByPk(complaint.locationId);

    console.log('success');
    console.log('location emial'+location_result.email);

    const id = complaint.userId;
    User.findByPk(id)
      .then((user_data) => {
        if (user_data) {
          const transporter = nodemailer.createTransport({
            host: 'us2.smtp.mailhostbox.com',
            port: 25,
            auth: {
              user: 'admin@sharemydish.com',
              pass: '*xio!h#3',
            },
          }); transporter.verify().then(console.log).catch(console.error);

          var mailOptions = {
            from: 'admin@sharemydish.com',
            to: user_data.email,
            subject: 'New Complaint Added',
            text: 'New Complaint Added', // plain text body
            html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear ' + capitalizeFirstLetter(user_data.name) + ' </b></span>, </br></br> <SPAN STYLE="font-size:13.0pt"> your Complaint has been submitted, </br> Admin will review ',

          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          var mailOptionsAdmin = {
            from: 'admin@sharemydish.com',
            to: 'sagarmelmatti@gmail.com',
            subject: 'Review New Complaint',
            text: 'New Complaint has been registered', // plain text body
            html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear Admin New complaint has been posted, </br> Kindly review / forward it to concern person'+
            
            '<p> Complaint details mentioned below : <p>'+
            ' User Name: ' + user_data.name + 
            ' <br> Email : ' + user_data.email +
            ' <br> Location : ' + location_result.name +
            ' <br> Complaint In Short : ' + complaint_result.title +
            ' <br> Complaint Description: ' + complaint_result.description +'',

          };

          transporter.sendMail(mailOptionsAdmin, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          var mailOptionsLocationHead = {
            from: 'admin@sharemydish.com',
            to: location_result.email,
            subject: 'New Complaint Registered For your location',
            text: 'New Complaint Added', // plain text body
            html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear ' + capitalizeFirstLetter(location_result.headName) + ' </b></span>, </br></br> <SPAN STYLE="font-size:13.0pt"> New Complaint has been registred for your location, </br> Kindly review '+
            '<p> Details mentioned below: <p>'+
            ' User Name: ' + user_data.name + 
            ' <br> Email : ' + user_data.email +
            ' <br> Location : ' + location_result.name +
            ' <br> Complaint In Short : ' + complaint_result.title +
            ' <br> Complaint Description: ' + complaint_result.description +'',
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


// Retrieve all Tutorials from the database (with condition).
exports.sendEmail = async (req, res) => {

  const opts = {
    errorCorrectionLevel: 'H',
    type: 'terminal',
    quality: 0.95,
    margin: 1,
    width: 300,
    height: 300,
    color: {
      dark: '#208698',
      light: '#FFF',
    },
  }

  let transporter = nodemailer.createTransport({
    host: 'mailserver.vi.corp',
    port: 25,
    tls: {
      rejectUnauthorized: false
    }
  });

  await Employee.getAllWithoutEmail((err, employees) => {
    if (err)
      res.send(err);

    employees.forEach(async employee => {
      if (typeof employee.employee_code !== 'undefined') {
        let employee_name = employee.name.split(" ")[0]
        let img = await QRCode.toDataURL(employee.employee_code, opts);
        let mailOptions = {
          //from: 'voicejashn@gmail.com',
          from: 'VOICE JASHN 2023 <voiceannualday@vanderlande.com>',
          to: employee.email,
          subject: 'QR Code for Jashn 2023!',
          text: 'Kindly Save QR Code for Annual Day Verification', // plain text body
          html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear ' + capitalizeFirstLetter(employee_name) + ' </b></span>, </br></br> <SPAN STYLE="font-size:13.0pt"> Thank you for your confirmation on attending Jashn 2023! </br>Here’s your unique QR code which is essential for seamless entry at the venue for you and your family members. </SPAN></br></br> <img src="' + img + '"> </br></br> <SPAN STYLE="font-size:12.0pt"> We look forward to have a great time with you all! </span></br></br> Regards, </br> VOICE JASHN 2023 Committee ', // html body

        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            //res.send("Error in Sending Email");
          } else {
            console.log('Email sent: ' + info.response);
            employee.email_sent_status = 1;
            Employee.updateEmailSentStatus(
              employee.employee_code,
              new Employee(employee),
              (err, data) => {
                if (err) {
                  if (err.kind === "not_found") {
                    res.status(404).send({
                      message: `Not found Employee with employee_code ${employee.employee_code}.`
                    });
                  } else {
                    res.status(500).send({
                      message: "Error updating Employee with employee_code " + employee.employee_code
                    });
                  }
                }
                //else res.send(data);
              }
            );

          }

        });

        // res.send({
        //   message: "Email sent Successfully",
        // });
      }
    });

    res.send({
      message: "Email sent Successfully"
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