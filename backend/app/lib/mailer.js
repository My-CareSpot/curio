var mongoose = require("mongoose");
const async = require("async");
const ejs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

// EmailTemplate = mongoose.model("emailTemplate");
const config = require("../config/config").get(process.env.NODE_ENV || "local");

module.exports = {
  sendMail: sendMail,
  sendMailToUser: sendMailToUser,
  sendMailTO: sendMailTO,
  sendMailToHospital:sendMailToHospital
};

var transporter = nodemailer.createTransport(
  smtpTransport({
    service: config.smtp.service,
    port: 465,
    secure: true,
    host: config.smtp.host,
    auth: {
      user: config.smtp.username,
      pass: config.smtp.password,
    },
  })
);

function sendMailToHospital(to, userData) {
  console.log("CONFIG", config);
  async function sendMailToHospital() {
    var mailOptions = {
      from: "CURIO",
      to: to,
      subject: userData.subject,
      html:
        " <div style='width:100px;height:100px'><img src=" +
        "'" +
        userData.message.image +
        "'" +
        " style='width:100%;height:100%'></div></br><span style='color:#007bff'>Hello" +
        userData.name +
        "</span></br><div style='color:#007bff'><span>Welcome to Curio Family.Your email address has been confirmed with us. Please fell free to contact Curio Admin for login Detail and any Query</span><div style='padding:5px; margin:5px'><a href=" +
        "'" +
        userData.message.links +
        "'" +
        " style='color:white; background-color:#007bff;padding:5px; margin-left:5px;text-decoration:none'>Click Here</a></div></div>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }

  sendMailToHospital().then(function () {});
}

function sendMailTO(to, userData) {
  console.log("CONFIG", config);
  async function sendMailTO() {
    var mailOptions = {
      from: "CURIO",
      to: to,
      subject: userData.subject,
      html:
        " <div style='width:100px;height:100px'><img src=" +
        "'" +
        userData.message.image +
        "'" +
        " style='width:100%;height:100%'></div></br><span style='color:#007bff'>Hello</span></br><div style='color:#007bff'><span>Your email address has been confirmed with us. Please register and set password by clicking the link below </span><div style='padding:5px; margin:5px'><a href=" +
        "'" +
        userData.message.links +
        "'" +
        " style='color:white; background-color:#007bff;padding:5px; margin-left:5px;text-decoration:none'>Click Here</a></div></div>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }

  sendMailTO().then(function () {});
}

function sendMailToUser(to, userData) {
  async function sendMailToUser() {
    let andoridImage =
      "https://careportal.curio-dtx.com/upload/0.1994063429677555googleplay.jpg ";
    let iosImage =
      "https://careportal.curio-dtx.com/upload/0.11859185064862188appstore.jpg";
    var mailOptions = {
      from: "CURIO",
      to: to,
      subject: userData.subject,
      html:
        " <div style='width:100px;height:100px'><img src=" +
        "'" +
        userData.image +
        "'" +
        " style='width:100%;height:100%'></div></br><span style='color:#007bff'>Hello</span></br><div style='color:#007bff'><span>Welcome to Curio App !!! You have been invited to " +
        userData.programname +
        " " +
        "Program" +
        " " +
        ". Please download the App from Google Play or Appstore .</span><div style='padding:5px; margin:5px'><a href=" +
        "'" +
        userData.adlink +
        "'" +
        " style='width:100px;height:100px'><img src=" +
        "'" +
        andoridImage +
        "'" +
        " style='width:170px;height:80px'></a></br><a href=" +
        "'" +
        userData.ioslink +
        "'" +
        " style='width:100px;height:100px'><img src=" +
        "'" +
        iosImage +
        "'" +
        " style='width:170px;height:80px'></a></div></div>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }

  sendMailToUser().then(function () {});
}

function sendMail(to, keyword, userData, callbackMail) {
  async function sendMail() {
    // let temp = {
    //     title : 'Registration',
    //     createdDate : new Date(),
    //     modifiedDate : new Date(),
    //     unique_keyword : 'registrationregistration',
    //     subject : 'Complete your registration',
    //     description : 'hello',
    //     isDeleted : false,
    //     isActive : false
    // }

    // let addEmailEntry = await query.InsertIntoCollection(EmailTemplate,temp);
    emailtemplates.findOne(
      { unique_keyword: String(keyword), isDeleted: false },
      function (err, template) {
        if (err) {
          callbackMail(err, null);
          console.log("err", err);
        } else {
          if (userData.adminEmail) {
            to = userData.adminEmail;
          } else {
            to = to;
          }
          replacePlaceholders(
            userData,
            template.description,
            template.subject,
            function (mailContent, subject) {
              var options = { mailbody: mailContent };
              generateTemplate(options, function (mailContent) {
                var mailOptions = {
                  from: config.smtp.mailUsername, //config.smtp.mailUsername, // sender address
                  to: to, // list of receivers
                  subject: subject, // Subject line
                  html: mailContent, // Mail content body
                };

                if (config.env == "local" || config.env == "staging") {
                  //local and staging
                  transporter.sendMail(mailOptions, function (error, info) {
                    // send mail with defined transport object
                    if (error) {
                      callbackMail(error, null);
                    } else {
                      var returnMsg = "Mail sent successfully";
                      callbackMail(null, { message: returnMsg });
                    }
                  });
                } else {
                  //Live
                  const params = {
                    Destination: {
                      ToAddresses: [to],
                    },
                    Message: {
                      Body: {
                        Html: {
                          Charset: "UTF-8",
                          Data: mailOptions.html,
                        },
                      },
                      Subject: {
                        Charset: "UTF-8",
                        Data: mailOptions.subject,
                      },
                    },
                    ReturnPath: config.aws_ses.fromName,
                    Source: config.aws_ses.fromName,
                  };

                  ses.sendEmail(params, (err, data) => {
                    if (err) {
                      callbackMail(err, null);
                    } else {
                      var returnMsg = "Mail sent successfully";
                      callbackMail(null, { message: returnMsg });
                    }
                  });
                }
              });
            }
          );
        }
      }
    );
  }
  sendMail();
}
var generateTemplate = function (options, callbackg) {
  var recepient = options.recepient || "",
    mailbody = options.mailbody;

  var fileName = path.resolve("./api/lib/mailTemplate.html");
  ejs.renderFile(
    fileName,
    { recepient: recepient, mailbody: mailbody },
    {},
    function (err, str) {
      if (err) {
        callbackg(mailbody);
      } else {
        callbackg(str || mailbody);
      }
    }
  );
};
var currYear = new Date().getFullYear();
var MDoutUrl = config.baseUrl;

var replacePlaceholders = function (data, mailbody, subj, callbackr) {
  var content = mailbody.replace(/\[\[(.*?)\]\]/g, function (match, token) {
    switch (token) {
      case "BASEURL":
        return config.baseUrl;
        break;
      case "Password":
        return data.password;
        break;
      case "Email":
        return data.email;
        break;
      case "verifingLink":
        return (
          "<a style ='border-bottom:1px solid #d7d7d7;font-size: 16px;background:#028dd8;color:#fff;text-align:center;padding: 10px 20px 7px;font-weight:normal;display: inline-block;margin: 10px 0;text-decoration: none;' href='" +
          data.verifingLink +
          "' target='_blank'>Verify Email Address</a>"
        );
        break;
      case "loginLink":
        return (
          "<a style ='border-bottom:1px solid #d7d7d7;font-size: 16px;background:#028dd8;color:#fff;text-align:center;padding: 10px 20px 7px;font-weight:normal;display: inline-block;margin: 10px 0;text-decoration: none;' href='" +
          data.loginLink +
          "' target='_blank'>Check newly added content</a>"
        );
        break;
      case "assignSurveyLink":
        return (
          "<a style ='border-bottom:1px solid #d7d7d7;font-size: 16px;background:#028dd8;color:#fff;text-align:center;padding: 10px 20px 7px;font-weight:normal;display: inline-block;margin: 10px 0;text-decoration: none;' href='" +
          data.assignSurveyLink +
          "' target='_blank'>Click Here To Start</a>"
        );
        break;
      case "Link":
        return data.link;
        break;
      case "SenderName":
        return data.senderName;
        break;
      case "MDoutUrl":
        return MDoutUrl;
        break;
      case "currYear":
        return currYear;
        break;
      case "Password":
        return data.password;
        break;
      case "Name":
        return data.name;
        break;
      case "MessageBody":
        return data.message;
        break;
      case "SurveyName":
        return data.surveyName;
        break;
      case "ClinicName":
        return data.clinicName;
        break;
      case "PhoneNumber":
        return data.phoneNumber;
        break;
      case "ClinicEmail":
        return data.clinicEmail;
        break;
      case "ClinicLogo":
        return data.clinicLogo;
        break;
      case "BackendBASEURL":
        return config.backendBaseUrl;
        break;
      case "physicianName":
        return data.physicianName;
        break;
      case "patientName":
        return data.patientName;
        break;
      case "appointMentDate":
        return data.appointMentDate;
        break;
      case "startTime":
        return data.startTime;
        break;
      case "endTime":
        return data.endTime;
        break;
      case "URL":
        return data.url;
        break;
      case "contenet":
        return data.contenet;
        break;
      case "CouponCode":
        return data.coupon_code;
        break;
      case "Lawfirm":
        return (
          data.lawfirm.charAt(0).toUpperCase() +
          data.lawfirm.slice(1).toLowerCase()
        );
        break;
      case "NewPasswordLink":
        return data.newpasswordlink;
        break;
    }
  });
  var subject = subj.replace(/\[\[(.*?)\]\]/g, function (match1, token1) {
    switch (token1) {
      case "ReceiverFname":
        return data.firstName;
        break;
      case "ReceiverLname":
        return data.lastName;
        break;
    }
  });
  if (content && subject) {
    callbackr(content, subject);
  }
};
