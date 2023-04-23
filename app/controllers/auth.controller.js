const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require('nodemailer');
const User = db.user;
const Role = db.role;
const UserRoles = db.userRoles;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        departmentId: req.body.departmentId,
        status: 'D',
        userType: req.body.userType
    })
        .then(user => {
            UserRoles.create({
                roleId: '2',
                userId: user.id
            }).then(userRoles => {
                res.send({ message: "User registered successfully!" });

                const transporter = nodemailer.createTransport({
                    host: 'us2.smtp.mailhostbox.com',
                    port: 587,
                    auth: {
                        user: 'admin@sharemydish.com',
                        pass: '*xio!h#3',
                    },
                  });transporter.verify().then(console.log).catch(console.error);

                var mailOptions = {
                    from: 'admin@sharemydish.com',
                    to: user.email,
                    subject: 'Employee Registration',
                    text: 'Employee registered succresfully', // plain text body
                    html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear '+ capitalizeFirstLetter(user.name) +' </b></span>, </br></br> <SPAN STYLE="font-size:13.0pt"> You have been registered succesfully </br> Admin will review ',
                
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  }); 

                var mailOptionsAdmin = {
                    from: 'admin@sharemydish.com',
                    to: 'sagarmelmatti@gmail.com',
                    subject: 'Review New Employee',
                    text: 'New Employee has been registered', // plain text body
                    html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear Admin New employee has been registered kindly review ,' +
                    'Details mentioned below: '+
                    '<p>    <br> Name: ' + capitalizeFirstLetter(user.name) + 
                    '       <br> Email : ' + capitalizeFirstLetter(user.email) +
                    '       <br> Location : ' + capitalizeFirstLetter(user.email)+'',
                
                  };
                  
                  transporter.sendMail(mailOptionsAdmin, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
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
                return res.status(404).send({ message: "User Not found." });
            } else if(user.status == 'D'){
                return res.status(401).send({ message: "User Not Activated yet." });
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
                    roles: authorities,
                    accessToken: token
                });
            });
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