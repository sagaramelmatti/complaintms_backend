const nodemailer = require('nodemailer');
// Require the package
const QRCode = require('qrcode')

const transporter = nodemailer.createTransport({
  host: 'smtp.sharemydish.com',
  port: 587,
  auth: {
    user: 'admin@sharemydish.com',
    pass: '*xio!h#3',
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
    from: 'admin@sharemydish.com',
    //to: 'sagar.melmatti@vanderlande.com',
    to: 'sagarmelmatti@gmail.com',
    subject: 'New Employee Registration',
    text: 'New Employee has been registered', // plain text body
    html: '</br><SPAN STYLE="font-size:12.0pt"> <b>Dear user </b></span>, </br></br> <SPAN STYLE="font-size:13.0pt"> You have been registered succesfully </br> Admin will review ',

  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 


 