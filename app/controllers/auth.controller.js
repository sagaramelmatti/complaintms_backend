const db = require("../models");
const config = require("../config/auth.config");
const email_config = require("../config/email.json");
const nodemailer = require('nodemailer');
const User = db.user;
const Role = db.role;
const UserRoles = db.userRoles;
const Location = db.locations;
const Department = db.departments;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var sender_email = email_config.sender_email;
var sender_password = email_config.sender_password;
var sender_host = email_config.host;
var sender_port = email_config.port;
var admin_email = email_config.admin_email;

exports.signup = async (req, res) => {
  // Save User to Database

  const location_result = await Location.findByPk(req.body.locationId);
  const department_result = await Department.findByPk(req.body.departmentId);

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    departmentId: req.body.departmentId,
    locationId: req.body.locationId,
    status: 'A',
    userType: 'U'
  })
    .then(user => {
      UserRoles.create({
        roleId: '2',
        userId: user.id
      }).then(userRoles => {
        res.send({ message: "User registered successfully!" });

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: sender_host,
          port: sender_port,
          secure: false,
          ignoreTLS: true,
          requireTLS: false,
          auth: {
            user: sender_email,
            pass: sender_password,
          },
        });
        transporter.verify().then(console.log).catch(console.error);

        var mailOptions = {
          from: sender_email,
          to: user.email,
          subject: 'Employee Registration',
          text: 'Employee registered successfully', // plain text body
          html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear ' + capitalizeFirstLetter(user.name) + ' </b></span>, </br> <SPAN STYLE="font-size:13.0pt"> <br/>You have been registered succesfully at BRPL IT Helpdesk Portal by IT Team. <br/>' +
            ' <p> For login check details below : </p>' +
            ' <br>Email : ' + req.body.email +
            ' <br>Password : ' + req.body.password +
            ' <br> Location : ' + location_result.name +
            ' <br> Department : ' + department_result.name + '',

        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent to user: ' + info.response);
          }
        });

        var mailOptionsAdmin = {
          service: 'gmail',
          from: sender_email,
          to: admin_email,
          subject: 'Review New Employee',
          text: 'New Employee has been registered', // plain text body
          html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear Admin, <br/> You have registered new Employee ' +
            '<br/> Kinldy check details mentioned below: ' +
            '<p> <br/> Name: ' + capitalizeFirstLetter(user.name) +
            ' <br/> Email : ' + user.email +
            ' <br/> Location : ' + location_result.name +
            ' <br/> Department : ' + department_result.name + '',

        };

        transporter.sendMail(mailOptionsAdmin, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent to admin: ' + info.response);
          }
        });


      });
      /*
      if (req.body.roles) {
          Role.findAll({
              where: {
                  name: {
                      [Op.or]: req.body.roles
                  }
              }
          }).then(roles => {
              user.setRoles(roles).then(() => {
                  res.send({ message: "User registered successfully!" });
              });
          });
      } else {
          // user role = 1
          user.setRoles([1]).then(() => {
              res.send({ message: "User registered successfully!" });
          });
      }
      */
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Invalid Email / Password." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          name: user.name,
          email: user.email,
          locationId: user.locationId,
          departmentId: user.departmentId,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Update a Location by the id in the request
exports.changePassword = (req, res) => {
  const id = req.params.id;

  // Create a Complaint
  const user = {
    password: bcrypt.hashSync(req.body.newPassword, 8),
  };

  User.update(user, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User password was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User password with id=${id}.!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User password with id=" + id,
      });
    });
};

// Update a Location by the id in the request
exports.forgotPassword = (req, res) => {

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {

      if (!user) {
        return res.status(404).send({ message: "Invalid Email / Password." });
      }

      // Create a Complaint
      const tempPass = randPass();
      console.log("temp pass="+tempPass);

      // Create a Complaint
      user = {
        password: bcrypt.hashSync(tempPass, 8),
      };
      
      console.log("bcrypt pass="+user.password);
      console.log("user email="+req.body.email);

      User.update(user, {
        where: { email: req.body.email },
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

      var mailOptions = {
        from: sender_email,
        to: req.body.email,
        subject: 'Reset Password',
        text: 'Reset Password', // plain text body
        html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear User </b>, <br/>You have requested to reset password <br/>' +
          ' <p> Kindly use below given password for login : <p>' +
          ' <br>New Password : ' + tempPass + '',
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent to user: ' + info.response);
        }
      });

      res.send("Password set successfully.");
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

function capitalizeFirstLetter(str) {
  // converting first letter to uppercase
  const capitalized = str.replace(/^./, str[0].toUpperCase());
  return capitalized;
}

function randPass() {
  var j, x, i;
  var result = '';
  var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var numbers = '0123456789';
  for (i = 0; i < 5; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (i = 0; i < 2; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  result = result.split("");
  for (i = result.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = result[i];
    result[i] = result[j];
    result[j] = x;
  }
  result = result.join("");
  return result
}