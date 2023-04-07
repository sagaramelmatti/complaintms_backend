const nodemailer = require('nodemailer');
// Require the package
const QRCode = require('qrcode')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'sagarmelmatti@gmail.com',
    pass: 'Dailycodebuffer@301#',
  },
});transporter.verify().then(console.log).catch(console.error);

let data = {
  qrcode:"YQN0P6Z4N1"
}


var opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  quality: 0.3,
  margin: 1,
  color: {
    dark:"#010599FF",
    light:"#FFBF60FF"
  }
}

  var mailOptions = {
    from: 'sagarmelmatti@gmail.com',
    //to: 'sagar.melmatti@vanderlande.com',
    to: 'sagar.melmatti@vanderlande.com',
    subject: 'New Employee Registration',
    text: 'New Employee has been registered', // plain text body
    html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear '+ capitalizeFirstLetter(employee_name) +' </b></span>, </br></br> <SPAN STYLE="font-size:13.0pt"> You have been registered succesfully </br> Admin will review ',

  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 


  var mailOptionsAdmin = {
    from: 'sagarmelmatti@gmail.com',
    //to: 'sagar.melmatti@vanderlande.com',
    to: 'sagar.melmatti@vanderlande.com',
    subject: 'Review New Employee',
    text: 'New Employee has been registered', // plain text body
    html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear Admin New employee has been registered kindly review ',

  };
  
  transporter.sendMail(mailOptionsAdmin, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });