"use strict";

const mongoose = require("mongoose");
const utility = require("../../../../lib/utility.js");

const jwt = require("jsonwebtoken");
const adobeModel = require("../../hospital/model/adobe_schema");

var SALT_WORK_FACTOR = 10;
var bcrypt = require("bcryptjs");

const CryptoJS = require("crypto-js");
const twilio = require("twilio");

const request = require("request");
const accountSid = "AC63adf28dad13c2e8e63d9b3b9c16b3f8";
const authToken = "7dacc6d4fae05b45534e53a4f56738e3";
const Client = require("twilio")(accountSid, authToken);

const socialhistories = require("../../user/model/socialhistory_schema");

const medicalhistories = require("../../user/model/medicalhistory_schema");

const medicationhistories = require("../../user/model/medicationhistory_schema");

const immunizationhistories = require("../../user/model/immunizationhistory_schema");

const familyhistories = require("../../user/model/familyhistory_schema");

const htmlToText = require("html-to-text");

const SECRET_KEY = "secret_key";

const jwtKey = "saloncrm";

const expiry = "100h";
const countryData = require("country-data").countries;
const constant = require("../../../../config/constant.js");

const Response = require("../../../../lib/response_handler.js");
const hospitals = require("../../hospital/model/hospital_schema");
const users = require("../../user/model/userSchema");
const hobbies = require("../../hospital/model/hobbies_schema");
const mailer = require("../../../../lib/mailer");
const patients = require("../model/patient_schema");
const validator = require("../../../../config/validator.js");
const Config = require("../../../../config/config").get(
  process.env.NODE_ENV || "local"
);
const commonQuery = require("../../../../lib/commonQuery.js");

const qs = require("querystring");

module.exports = {
  firstFunction: firstFunction,
  assignHobbyToPatient: assignHobbyToPatient,
  updateUserOnRegisteration: updateUserOnRegisteration,
  addPatient: addPatient,
  sendPatientRegistrationLink: sendPatientRegistrationLink,
  getSocialHistoyOfUser: getSocialHistoyOfUser,
  getMedicalHistoryOfUser: getMedicalHistoryOfUser,
  getFamilyHistoryOfUser: getFamilyHistoryOfUser,
  getMedicationHistoryData: getMedicationHistoryData,
  getImmunizationHistoryOfUser: getImmunizationHistoryOfUser,
  deleteSocialHistoryOfUser: deleteSocialHistoryOfUser,
  deleteImmunizationHistory: deleteImmunizationHistory,
  deleteMedicalHistory: deleteMedicalHistory,
  deleteMedicationHistory: deleteMedicationHistory,
  deleteFamilyHistory: deleteFamilyHistory,
  checkTokenFetchData: checkTokenFetchData,
  getCBTCatelog: getCBTCatelog,
  getCBTCourses: getCBTCourses,
};

function getCBTCourses(req, res) {
  async function getCBTCourses() {
    try {
      if (req.body.courseId) {
        let authorizationToken = await commonQuery.findoneData(adobeModel);
        if (authorizationToken.access_token) {
          let courseId = req.body.courseId.split(":")[1];
          let refreshUri = `https://captivateprime.adobe.com/primeapi/v2/learningObjects/course%3A${courseId}?include=instances%2Cinstances.loResources%2Cinstances.loResources.resources`;
          request(
            {
              headers: {
                Authorization: authorizationToken.access_token,
                Accept: "application/vnd.api+json",
              },
              uri: refreshUri,
              method: "GET",
              json: true,
            },
            function (error, response, body) {
              if (body && body.included && body.included.length > 0) {
                let objArray = [];
                for (let x of body.included) {
                  if (x.id == req.body.courseInstance) {
                    let loResource = x.relationships.loResources.data;
                    for (let y of loResource) {
                      for (let z of body.included) {
                        if (y.id == z.id) {
                          let eachObj = {
                            resourceId: z.relationships.resources.data[0].id,
                            name: z.attributes.localizedMetadata[0].name,
                          };
                          let statusUrl = true;
                          for (let a of body.included) {
                            if (statusUrl) {
                              if (
                                a.id == z.relationships.resources.data[0].id
                              ) {
                                eachObj.url = a.attributes.contentZipUrl;
                                statusUrl = false;
                                objArray.push(eachObj);
                                objArray.sort(function (a, b) {
                                  var textA = a.resourceId.toUpperCase();
                                  var textB = b.resourceId.toUpperCase();
                                  return textA < textB
                                    ? -1
                                    : textA > textB
                                    ? 1
                                    : 0;
                                });
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                if (objArray && objArray.length > 0) {
                  res.json(
                    Response(
                      constant.SUCCESS_CODE,
                      constant.UPDATE_SUCCESS,
                      objArray
                    )
                  );
                } else {
                  res.json(
                    Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS)
                  );
                }
              } else {
                res.json(
                  Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS)
                );
              }
            }
          );
        }
      }
    } catch (err) {
      console.log("Error in getCBTCourses");
    }
  }
  getCBTCourses().then((response) => {});
}

function getCBTCatelog(req, res) {
  async function getCBTCatelog() {
    try {
      let authorizationToken = await commonQuery.findoneData(adobeModel);
      if (authorizationToken.access_token) {
        let refreshUri =
          "https://captivateprime.adobe.com/primeapi/v2/learningObjects?page[limit]=10&filter.loTypes=course&filter.catalogIds=103166&sort=name";
        request(
          {
            headers: {
              Authorization: authorizationToken.access_token,
              Accept: "application/vnd.api+json",
            },
            uri: refreshUri,
            method: "GET",
            json: true,
          },
          function (error, response, body) {
            if (body && body.data && body.data.length > 0) {
              let resDataArray = [];
              for (let x of body.data) {
                let resData = {
                  courseId: x.id,
                  courseInstance: x.relationships.instances.data[0].id,
                  courceName: x.attributes.localizedMetadata[0].name,
                };
                resDataArray.push(resData);
              }

              res.json(
                Response(
                  constant.SUCCESS_CODE,
                  constant.UPDATE_SUCCESS,
                  resDataArray
                )
              );
            } else {
              res.json(
                Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS)
              );
            }
          }
        );
      }
    } catch (err) {
      console.log("Error in getCBTCatelog");
    }
  }
  getCBTCatelog().then((response) => {});
}

function firstFunction(req, res) {
  async function firstFunction() {
    try {
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }
  firstFunction().then(function () {});
}

function updateUserOnRegisteration(req, res) {
  console.log("REQ", req.body);
  async function updateUserOnRegisteration() {
    let hashPassword;
    let patientdata;
    try {
      if (req.body && req.body._id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body._id) };

        let findUserData = await commonQuery.findoneData(users, condition);

        console.log("condition", condition);
        users.findById(mongoose.Types.ObjectId(req.body._id), async function (
          err,
          result
        ) {
          if (err) {
          } else {
            patientdata = result;
            result.password = req.body.password;
            result.userType = req.body.userType

            result.save();
          }
        });

        let dataToUpdate = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          middleName: req.body.middleName,
          phoneCountry: req.body.phoneCountry,
          phoneNumber: req.body.phoneNumber,
          countryCode: req.body.countryCode,
          profession: req.body.profession,
          gender: req.body.gender,
          password: hashPassword,
          userType:req.body.userType||"patient"
        };

        dataToUpdate.email = findUserData.email;
        console.log("DATATI", dataToUpdate);
        let updateThePatientData = await commonQuery.updateOne(
          users,
          condition,
          dataToUpdate
        );

        console.log("upf", updateThePatientData);
        if (updateThePatientData) {
          if(dataToUpdate.userType!="hospital"){
            resisterToLMS(dataToUpdate);
          }
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              updateThePatientData
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
  updateUserOnRegisteration().then(function () {});
}

function resisterToLMS(registerUser) {
  async function resisterToLMS() {
    let authorizationToken = await commonQuery.findoneData(adobeModel);
    if (authorizationToken.access_token) {
      let form = {};
      let bodyObj = {
        data: {
          type: "user",
          attributes: {
            email: registerUser.email,
            state: "ACTIVE",
            userType: "INTERNAL",
          },
        },
      };
      bodyObj.data.attributes.name =
        `${registerUser.firstName} ` +
        `${registerUser.middleName ? registerUser.middleName : ""} ` +
        `${registerUser.lastName}`;
      let refreshUri = "https://captivateprime.adobe.com/primeapi/v2/users";
      request(
        {
          headers: {
            "Content-Type": "application/vnd.api+json;charset=UTF-8",
            Authorization: authorizationToken.access_token,
            Accept: "application/vnd.api+json",
          },
          uri: refreshUri,
          body: bodyObj,
          method: "POST",
          json: true,
        },
        function (error, response, body) {
          if (
            body &&
            body.data.attributes &&
            body.data.attributes.email &&
            body.data.id
          ) {
            let checkObj = {
              email: body.data.attributes.email,
            };
            let updateObj = {
              userLMS_id: body.data.id,
            };
            let resgister = commonQuery.updateOne(users, checkObj, updateObj);
            console.log();
          }
          if (error) {
            console.log("error in resisterToLMS");
          }
        }
      );
    }
  }
  resisterToLMS().then((response) => {});
}

function checkTokenFetchData(req, res) {
  async function checkTokenFetchData() {
    try {
      if (req.body && req.body.hashToken) {
        let condition = { hashToken: req.body.hashToken };

        let fetchUserData = await commonQuery.findoneData(users, condition);
        if (fetchUserData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              fetchUserData
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
        Response(
          constant.INTERNAL_ERROR,
          constant.REQUIRED_FIELDS_MISSING,
          error
        )
      );
    }
  }
  checkTokenFetchData().then(function () {});
}

function getSocialHistoyOfUser(req, res) {
  async function getSocialHistoyOfUser() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          user_id: mongoose.Types.ObjectId(req.body.user_id),
          isActive: true,
          isDeleted: false,
        };

        let socialHistoryData = await commonQuery.fetch_all(
          socialhistories,
          condition
        );

        if (socialHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              socialHistoryData
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
  getSocialHistoyOfUser().then(function () {});
}

function getMedicalHistoryOfUser(req, res) {
  async function getMedicalHistoryOfUser() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          user_id: mongoose.Types.ObjectId(req.body.user_id),
          isActive: true,
          isDeleted: false,
        };

        let medicalHistoryData = await commonQuery.fetch_all(
          medicalhistories,
          condition
        );

        if (medicalHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              medicalHistoryData
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
  getMedicalHistoryOfUser().then(function () {});
}

function getFamilyHistoryOfUser(req, res) {
  async function getFamilyHistoryOfUser() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          user_id: mongoose.Types.ObjectId(req.body.user_id),
          isActive: true,
          isDeleted: false,
        };

        let medicalHistoryData = await commonQuery.fetch_all(
          familyhistories,
          condition
        );

        if (medicalHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              medicalHistoryData
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
  getFamilyHistoryOfUser().then(function () {});
}

function getMedicationHistoryData(req, res) {
  async function getMedicationHistoryData() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          user_id: mongoose.Types.ObjectId(req.body.user_id),
          isActive: true,
          isDeleted: false,
        };

        let medicalHistoryData = await commonQuery.fetch_all(
          medicationhistories,
          condition
        );

        if (medicalHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              medicalHistoryData
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
  getMedicationHistoryData().then(function () {});
}

function getImmunizationHistoryOfUser(req, res) {
  async function getImmunizationHistoryOfUser() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          user_id: mongoose.Types.ObjectId(req.body.user_id),
          isActive: true,
          isDeleted: false,
        };

        let medicalHistoryData = await commonQuery.fetch_all(
          immunizationhistories,
          condition
        );

        if (medicalHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              medicalHistoryData
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
  getImmunizationHistoryOfUser().then(function () {});
}

function sendPatientRegistrationLink(req, res) {
  // console.log("req.body", req.body);
  async function sendPatientRegistrationLink() {
    try {
      let savePatientData;
      if (req.body && req.body.email) {
        let condition = { email: req.body.email };

        let findIfUserExist = await commonQuery.findoneData(users, condition);

        if (findIfUserExist) {
          res.json(
            Response(
              constant.ALLREADY_EXIST,
              constant.USER_ALREADY_EXIST,
              findIfUserExist
            )
          );
        } else {
          var hashToken = Math.random(new Date())
            .toString(25)
            .replace(/[^a-z-^0-1000-z-aA-Z]+/g, "")
            .substr(0, 100);
          console.log("HASHTOKEN", hashToken);

          let userToAdd = new users({
            email: req.body.email,
            hospital_id: mongoose.Types.ObjectId(req.body.user_id),
            hashToken: hashToken,
          })
            .save()
            .then((data) => {
              console.log("SAVE", data);
              savePatientData = data;
              let link =
                Config.frontendURL +
                "dashboard/patient-registration/" +
                hashToken;

              let imageUrl =
                "https://careportal.curio-dtx.com/upload/0.04706482568753878Logo.png";

              let messageData = {
                email: req.body.email,
                links: link,
                image: imageUrl,
              };

              let dataToPassN = {
                subject: "CURIO Registration",
                message: messageData,
              };

              mailer.sendMailTO(req.body.email, dataToPassN);

              console.log(
                "TO",
                "+" + req.body.countryCode + req.body.phoneNumber
              );

              let to = "+" + req.body.countryCode + req.body.phoneNumber;
              if (req.body.phoneNumber) {
                Client.messages
                  .create({
                    body:
                      "Hello" +
                      " " +
                      req.body.email +
                      " . Your email is confirmed with us. Please open the linked to register" +
                      " " +
                      link,
                    from: "+12056495578",
                    to: to.toString(),
                  })
                  .then((message) => console.log(message.sid));
              }
              res.json(
                Response(
                  constant.SUCCESS_CODE,
                  constant.NOTIFICATION_SEND,
                  savePatientData
                )
              );
            })
            .catch((error) => {
              res.json(
                Response(
                  constant.ERROR_CODE,
                  constant.FAILED_TO_PROCESS,
                  savePatientData
                )
              );
            });
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }
  sendPatientRegistrationLink().then(function () {});
}

function addPatient(req, res) {
  async function addPatient() {
    try {
      if (req.body && req.body.hospital_id) {
        let addPatientData = new patients({
          user_id: req.body.user_id,
          hospital_id: req.body.hospital_id,
        });

        let savePatient = await commonQuery.InsertIntoCollection(
          patients,
          addPatientData
        );
        if (savePatient) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, savePatient)
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
  addPatient().then(function () {});
}

function assignHobbyToPatient(req, res) {
  async function assignHobbyToPatient() {
    try {
      if (req.body && req.body.hobby_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.patient_id) };
        let updateCondition = { hobby_id: req.body.hobby_id };
        let assignHobby = await commonQuery.updateOneDocument(
          patients,
          condition,
          updateCondition
        );
        if (assignHobby) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, null)
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
  assignHobbyToPatient().then(function () {});
}

function deleteSocialHistoryOfUser(req, res) {
  async function deleteSocialHistoryOfUser() {
    try {
      if (req.body && req.body._id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body._id),
        };

        let updateCondition = { isActive: false, isDeleted: true };

        let socialHistoryData = await commonQuery.updateOne(
          socialhistories,
          condition,
          updateCondition
        );

        if (socialHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              socialHistoryData
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
  deleteSocialHistoryOfUser().then(function () {});
}

function deleteImmunizationHistory(req, res) {
  async function deleteImmunizationHistory() {
    try {
      if (req.body && req.body._id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body._id),
        };

        let updateCondition = { isActive: false, isDeleted: true };

        let socialHistoryData = await commonQuery.updateOne(
          immunizationhistories,
          condition,
          updateCondition
        );

        if (socialHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              socialHistoryData
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
  deleteImmunizationHistory().then(function () {});
}
function deleteMedicationHistory(req, res) {
  async function deleteMedicationHistory() {
    try {
      if (req.body && req.body._id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body._id),
        };

        let updateCondition = { isActive: false, isDeleted: true };

        let socialHistoryData = await commonQuery.updateOne(
          medicationhistories,
          condition,
          updateCondition
        );

        if (socialHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              socialHistoryData
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
  deleteMedicationHistory().then(function () {});
}
function deleteMedicalHistory(req, res) {
  async function deleteMedicalHistory() {
    try {
      if (req.body && req.body._id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body._id),
        };

        let updateCondition = { isActive: false, isDeleted: true };

        let socialHistoryData = await commonQuery.updateOne(
          medicalhistories,
          condition,
          updateCondition
        );

        if (socialHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              socialHistoryData
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
  deleteMedicalHistory().then(function () {});
}
function deleteFamilyHistory(req, res) {
  async function deleteFamilyHistory() {
    try {
      if (req.body && req.body._id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body._id),
        };

        let updateCondition = { isActive: false, isDeleted: true };

        let socialHistoryData = await commonQuery.updateOne(
          familyhistories,
          condition,
          updateCondition
        );

        if (socialHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              socialHistoryData
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
  deleteFamilyHistory().then(function () {});
}
