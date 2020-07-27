"use strict";

const mongoose = require("mongoose");
const utility = require("../../../../lib/utility.js");

const jwt = require("jsonwebtoken");

const groupvideocalls = require("../models/groupvideocall_schema");

const jwtKey = "saloncrm";

const videorelatednotifications = require("../models/videonotification_schema");

const bookings = require("../../hospital/model/booking_schema");

const users = require("../../user/model/userSchema");

var FCM = require("fcm-node");
var serverKey =
  "AAAAIT8W-_g:APA91bGg9Pd4zQhtGWwCWVPKfO13R_mrzpw9cts3Qi--Mck3pk_SCsDqSYAZOQOM9xaFJOFRzR_iO0y4Ut6gYI9_ygxkzMOAn9gK4bt8rtVsDTyano0e4djbyEdu9wm4EbiKMB-8GrhG";
var fcm = new FCM(serverKey);

let jsSHA = require("jssha");

let btoa = require("btoa");

const videotokens = require("../models/videotoken_schema");
const videonotifications = require("../models/videocallnotification_schema");
const moment = require("moment-timezone");
const expiry = "10h";
const countryData = require("country-data").countries;
const constant = require("../../../../config/constant.js");

const Response = require("../../../../lib/response_handler.js");
const validator = require("../../../../config/validator.js");
const Config = require("../../../../config/config").get(
  process.env.NODE_ENV || "local"
);
const commonQuery = require("../../../../lib/commonQuery.js");

module.exports = {
  generateToken: generateToken,
  checkTiming: checkTiming,
  notificationToPatientForCall: notificationToPatientForCall,
  sendNotificationToCareTaker: sendNotificationToCareTaker,
  missedCallNotificationPatientToDoctor: missedCallNotificationPatientToDoctor,
  getMissCallNotification: getMissCallNotification,
  declineVideoCallPatientToDoctor: declineVideoCallPatientToDoctor,
  declineVideoCallDoctorToPatient: declineVideoCallDoctorToPatient,
  createGroupSession: createGroupSession,
};

function createGroupSession(req, res) {
  async function createGroupSession() {
    try {
      if (req.body && req.body.session_name) {
        let groupSessionData = new groupvideocalls({
          session_name: req.body.session_name,
          caretaker_name: req.body.caretaker_name,
          caretaker_user_id: req.body.caretaker_user_id,
          hospital_user_id: req.body.hospital_user_id,
          session_time: req.body.session_time,
          session_date: req.body.session_date,
        });

        let saveGroupSession = await commonQuery.InsertIntoCollection(
          groupvideocalls,
          groupSessionData
        );
        if (saveGroupSession) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              saveGroupSession
            )
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }
  createGroupSession().then(function () {});
}

function declineVideoCallPatientToDoctor(req, res) {
  async function declineVideoCallPatientToDoctor() {
    try {
      const io = req.app.get("io");
      if (req.body && req.body.appointment_request_id) {
        let condition = {
          appointment_request_id: mongoose.Types.ObjectId(
            req.body.appointment_request_id
          ),
        };

        let fetchBooking = await commonQuery.findoneData(bookings, condition);
        if (fetchBooking) {
          let message =
            fetchBooking.patient_name + " " + "has declined your call";
          io.emit("declinedcall", message);
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.NOTIFICATION_SEND,
              fetchBooking
            )
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }
  declineVideoCallPatientToDoctor().then(function () {});
}

function declineVideoCallDoctorToPatient(req, res) {
  async function declineVideoCallDoctorToPatient() {
    try {
      let bookingData;
      if (req.body && req.body.appointment_request_id) {
        let condition = {
          appointment_request_id: mongoose.Types.ObjectId(
            appointment_request_id
          ),
        };

        let fetchBooking = await commonQuery.findoneData(bookings, condition);

        if (fetchBooking) {
          bookingData = fetchBooking;
          let conditionNew = {
            _id: mongoose.Types.ObjectId(fetchBooking.patient_user_id),
          };

          let patientData = await commonQuery.findoneData(users, conditionNew);

          if (patientData) {
            var message = {
              to: patientData.deviceToken ? patientData.deviceToken : "",
              collapse_key: "your_collapse_key",
              notification: {
                title: "Video Call Declined",
                body:
                  bookingData.caretaker_name + " " + "has declined the call",
              },
              data: {
                my_key: "CURIO",
                my_another_key: "NADIM",
                caretaker_name: bookingData.caretaker_name,
                caretaker_user_id: bookingData.caretaker_user_id,
                appointment_request_id: bookingData.appointment_request_id,
                patient_name: bookingData.patient_name,
                patient_user_id: bookingData.patient_user_id,
              },
            };
            fcm.send(message, async function (err, response) {
              if (err) {
                console.log("Something has gone wrong!", err);
              } else {
                console.log("Successfully sent with response: ", response);
              }
            });
            res.json(
              Response(
                constant.SUCCESS_CODE,
                constant.NOTIFICATION_SEND,
                bookingData
              )
            );
          } else {
            res.json(
              Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
            );
          }
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }
  declineVideoCallDoctorToPatient().then(function () {});
}

function missedCallNotificationPatientToDoctor(req, res) {
  async function missedCallNotificationPatientToDoctor() {
    try {
      const io = req.app.get("io");

      if (req.body && req.body.appointment_request_id) {
        let saveNotification = new videorelatednotifications({
          message: "You have missed a call from",
          caretaker_name: req.body.caretaker_name,
          patient_name: req.body.patient_name,
          patient_user_id: req.body.patient_user_id,
          caretaker_user_id: req.body.caretaker_user_id,
          appointment_request_id: req.body.appointment_request_id,
          hospital_user_id: req.body.hospital_user_id,
        });

        let addNotification = await commonQuery.InsertIntoCollection(
          videorelatednotifications,
          saveNotification
        );

        if (addNotification) {
          io.emit("misscallnotification");
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.NOTIFICATION_SEND,
              addNotification
            )
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }

  missedCallNotificationPatientToDoctor().then(function () {});
}

function getMissCallNotification(req, res) {
  async function getMissCallNotification() {
    // console.log("req.bodyzzzz", req.body);
    try {
      if (req.body && req.body.fromWhom) {
        let fromWhom = req.body.fromWhom;
        let condition = {};

        if (fromWhom === "hospital_user_id") {
          condition = {
            hospital_user_id: mongoose.Types.ObjectId(req.body.from),
          };
        } else if (fromWhom === "caretaker_user_id") {
          condition = {
            caretaker_user_id: mongoose.Types.ObjectId(req.body.from),
          };
        }
        //  console.log("for", JSON.parse(fromWhom));

        //console.log("CONDITION", condition);

        videorelatednotifications
          .find(condition)
          .sort({ createdAt: -1 })
          .exec(function (err, result) {
            if (err) {
              res.json(
                Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
              );
            } else {
              // console.log("RESULT", result);
              res.json(
                Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, result)
              );
            }
          });
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }
  getMissCallNotification().then(function () {});
}

function generateToken(req, res) {
  console.log("req.body", req.body);
  async function generateToken() {
    let userName = req.body.userName ? req.body.userName : "";
    let userId = req.body.userId ? req.body.userId : "";
    let appointmentId = req.body.appointmentId ? req.body.appointmentId : "";

    if (userId == "") {
      let userName = req.body.userName;
      let vCard = "";
      let key = "faf375b66fab43099ae96ec7d5e427f8"; // application key
      let appID = "eb4451.vidyo.io"; // application id
      let expiresInSeconds = 86400; // token expire time in seconds
      let host = "prod.vidyo.io";

      const EPOCH_SECONDS = 62167219200;
      const expires =
        Math.floor(Date.now() / 1000) + expiresInSeconds + EPOCH_SECONDS;
      const shaObj = new jsSHA("SHA-384", "TEXT");
      shaObj.setHMACKey(key, "TEXT");
      const jid = appointmentId + "@" + appID;
      const body =
        "provision" + "\x00" + jid + "\x00" + expires + "\x00" + vCard;
      shaObj.update(body);
      const mac = shaObj.getHMAC("HEX");
      const serialized = body + "\0" + mac;
      console.log("\nGenerated Token: \n" + btoa(serialized));
      let tokenkey = btoa(serialized);
      res.json(
        Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, tokenkey)
      );
    } else {
      videotokens
        .findOne({
          appointment_id: appointmentId,
          isDeleted: false,
        })
        .exec(function (err, tokenData) {
          if (err || tokenData == null || tokenData.length <= 0) {
            let vCard = "";
            let key = "faf375b66fab43099ae96ec7d5e427f8"; // application key  0b412c83761746d38c91bca276fded09
            let appID = "eb4451.vidyo.io"; // application id  7724fb
            let expiresInSeconds = 86400; // token expire time in seconds
            let host = "prod.vidyo.io";

            const EPOCH_SECONDS = 62167219200;
            const expires =
              Math.floor(Date.now() / 1000) + expiresInSeconds + EPOCH_SECONDS;
            const shaObj = new jsSHA("SHA-384", "TEXT");
            shaObj.setHMACKey(key, "TEXT");
            const jid = appointmentId + "@" + appID;
            const body =
              "provision" + "\x00" + jid + "\x00" + expires + "\x00" + vCard;
            shaObj.update(body);
            const mac = shaObj.getHMAC("HEX");
            const serialized = body + "\0" + mac;
            console.log("\nGenerated Token: \n" + btoa(serialized));
            let tokenkey = btoa(serialized);

            const saveTokenData = {
              user_id: userId,
              appointment_id: appointmentId,
              token: tokenkey,
              username: userName,
              isDeleted: false,
            };
            console.log("saveTokenData", saveTokenData);
            let toSaveTokenData = new videotokens(saveTokenData);
            toSaveTokenData.save(function (err, newTokenData) {
              if (err) {
                res.json(
                  Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, err)
                );
              } else {
                res.json(
                  Response(
                    constant.SUCCESS_CODE,
                    constant.FETCH_SUCCESS,
                    newTokenData
                  )
                );
              }
            });
          } else {
            res.json(
              Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, tokenData)
            );
          }
        });
    }
  }

  generateToken().then(function () {});
}

function checkTiming(req, res) {
  console.log("req", req.body);
  async function checkTiming() {
    if (req.body && req.body.patient_user_id) {
      let condition = {
        patient_user_id: mongoose.Types.ObjectId(req.body.patient_user_id),
        appointment_request_id: mongoose.Types.ObjectId(
          req.body.appointment_request_id
        ),
      };

      let bookingData = await commonQuery.findoneData(bookings, condition);

      let bookingDate = bookingData.appointment_date;

      // console.log("Booking Date", bookingDate, bookingData.appointment_time);
      let day = new Date(bookingData.appointment_date).getDate();
      let month = new Date(bookingData.appointment_date).getMonth();
      let year = new Date(bookingData.appointment_date).getFullYear();

      //console.log("DATE", day, month, year);

      let newAptTimeDate = new Date(bookingData.appointment_time).setDate(day);
      newAptTimeDate = new Date(newAptTimeDate).setMonth(month);
      newAptTimeDate = new Date(newAptTimeDate).setFullYear(year);

      //    console.log("NEWAPTTIME", new Date(newAptTimeDate));

      let appointmentTimeNew = moment
        .tz(newAptTimeDate, req.body.user_timezone)
        .subtract(10, "mm")
        .format("YYYY-MM-DD[T]HH:mm[Z]");

      if (bookingData) {
        let aptTime = moment
          .tz(bookingData.appointment_time, req.body.user_timezone)
          .subtract(10, "m")
          .format();

        if (moment(req.body.user_time).isAfter(appointmentTimeNew)) {
          // console.log("apTimeonUser apTimeonUser Call", aptTime);
          res.json(
            Response(constant.SUCCESS_CODE, constant.PROCESS_CALL, aptTime)
          );
        } else {
          //      console.log("apTimeonUser apTimeonUser No time", aptTime);
          //console.log("data", data);
          res.json(
            Response(constant.ERROR_CODE, constant.NOT_A_TIME_TO_CALL, aptTime)
          );
        }
      }
    }
  }
  checkTiming().then(function () {});
}

function notificationToPatientForCall(req, res) {
  console.log("EQBODY", req.body);
  async function notificationToPatientForCall() {
    if (req.body && req.body.patient_user_id) {
      const io = req.app.get("io");
      let condition = {
        _id: mongoose.Types.ObjectId(req.body.patient_user_id),
      };

      let userData = await commonQuery.findoneData(users, condition);
      console.log("USWRDATA", userData);
      if (userData) {
        let conditionnew = {
          appointment_request_id: mongoose.Types.ObjectId(
            req.body.appointment_request_id
          ),
          patient_user_id: mongoose.Types.ObjectId(req.body.patient_user_id),
        };
        let appointmentData = await commonQuery.findoneData(
          bookings,
          conditionnew
        );

        console.log("Appoiintme", appointmentData);

        if (appointmentData) {
          let aptTime = moment(appointmentData.appointment_time).format(
            "HH:mm A"
          );
          var message = {
            to: userData.deviceToken ? userData.deviceToken : "",
            collapse_key: "your_collapse_key",
            notification: {
              title: "Incoming Video Call",
              body: " from" + " " + appointmentData.caretaker_name,
            },
            data: {
              my_key: "CURIO",
              my_another_key: "NADIM",
              caretaker_name: appointmentData.caretaker_name,
              caretaker_user_id: appointmentData.caretaker_user_id,
              appointment_request_id: appointmentData.appointment_request_id,
              patient_name: appointmentData.patient_name,
              patient_user_id: appointmentData.patient_user_id,
            },
          };
          io.emit("videonotification",message);
          fcm.send(message, async function (err, response) {
            if (err) {
              console.log("Something has gone wrong!", err);
            } else {
              console.log("Successfully sent with response: ", response);
            }
          });
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.NOTIFICATION_SEND,
              appointmentData
            )
          );
        }
      }
    }
  }
  notificationToPatientForCall().then(function () {});
}

function sendNotificationToCareTaker(req, res) {
  async function sendNotificationToCareTaker() {
    try {
      let videoTokenNewData;
      if (req.body && req.body.appointment_request_id) {
        const io = req.app.get("io");
        let userId = req.body.patient_user_id;
        let appointmentId = req.body.appointment_request_id;
        let userName = req.body.patient_name;

        let sendNotification = new videonotifications({
          appointment_request_id: req.body.appointment_request_id,
          patient_name: req.body.patient_name,
          caretaker_name: req.body.caretaker_name,
          hospital_user_id: req.body.hospital_user_id,
          caretaker_user_id: req.body.caretaker_user_id,
          patient_user_id: req.body.patient_user_id,
          appointment_time: req.body.appointment_time,
          appointment_date: req.body.appointment_date,
        });

        let addVideoCallNotification = await commonQuery.InsertIntoCollection(
          videonotifications,
          sendNotification
        );

        if (addVideoCallNotification) {
          io.emit("videocallnotification");
          io.emit("videocall");

          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.NOTIFICATION_SEND,
              addVideoCallNotification
            )
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }
  sendNotificationToCareTaker().then(function () {});
}
