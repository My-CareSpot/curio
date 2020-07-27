"use strict";

const mongoose = require("mongoose");
const utility = require("../../../../lib/utility.js");

const jwt = require("jsonwebtoken");

const jwtKey = "saloncrm";

const medicalhistories = require("../model/medicalhistory_schema");

const socialhistories = require("../model/socialhistory_schema");

const medicationhistories = require("../model/medicationhistory_schema");

const immunizationhistories = require("../model/immunizationhistory_schema");

const familyhistories = require("../model/familyhistory_schema");

const expiry = "10h";
const countryData = require("country-data").countries;
const constant = require("../../../../config/constant.js");

const users = require("../model/userSchema");

const useraddresses = require("../model/user_address_schema");

const addresses = require("../model/address_schema");

const Response = require("../../../../lib/response_handler.js");
const validator = require("../../../../config/validator.js");
const Config = require("../../../../config/config").get(
  process.env.NODE_ENV || "local"
);
const commonQuery = require("../../../../lib/commonQuery.js");
const adobeModel = require("../../hospital/model/adobe_schema");
const request = require("request");
const urlLmsV2 = "https://captivateprime.adobe.com/primeapi/v2";
const mailer = require("../../../../lib/mailer");

module.exports = {
  firstFunction: firstFunction,
  registerHospital: registerHospital,
  loginHospital: loginHospital,
  addAddress: addAddress,
  deleteUser: deleteUser,
  getUserDetails: getUserDetails,
  editUserDetails: editUserDetails,
  addMedicalHistory: addMedicalHistory,
  addManyFamilyHistory: addManyFamilyHistory,
  addSocialHistory: addSocialHistory,
  addImmunizationHistory: addImmunizationHistory,
  addMedicationHistory: addMedicationHistory,
  addFamilyHistory: addFamilyHistory,
  updateFamilyHistory: updateFamilyHistory,
  updateMedicalHistory: updateMedicalHistory,
  updateMedicationHistory: updateMedicationHistory,
  updateSocialHistory: updateSocialHistory,
  updateImmunizationHistory: updateImmunizationHistory,
  changePassword: changePassword,
  addImage: addImage,
  changeUserNotificationPrefrences: changeUserNotificationPrefrences,
  notificationSetting: notificationSetting,
  addManyImmunizationHistory: addManyImmunizationHistory,
  superadminlogin: superadminlogin,
  SuperAdminRegister: SuperAdminRegister,
  gethospitallist: gethospitallist,
  deletehospitallist: deletehospitallist,
  checkUserData: checkUserData,
};

function deletehospitallist(req, res) {
  async function deletehospitallist() {
    try {
      if (req.body && req.body.user_id) {
        let searchObj = {
          _id: req.body.user_id,
          userType: "hospital",
          islive: true,
        };
        let toUpdate = {
          islive: false,
        };

        let isDeleted = await commonQuery.updateOneDocument(
          users,
          searchObj,
          toUpdate
        );
        if (isDeleted) {
          res.json(Response(constant.SUCCESS_CODE, constant.DELETE_SUCCESS));
        }
      } else {
        res.json(
          Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
        );
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  deletehospitallist().then(function () {});
}

function gethospitallist(req, res) {
  async function gethospitallist() {
    try {
      if (req.body && req.body.userType) {
        let condition;
        if (req.body.type == "subadmin") {
          condition = {
            relatedId: mongoose.Types.ObjectId(req.body.relatedId),
            userType: req.body.userType,
            islive: true,
          };
        } else {
          condition = {
            hospital_id: mongoose.Types.ObjectId(req.body.hospitalId),
            userType: req.body.userType,
            islive: true,
          };
        }
        let hospitallist = await commonQuery.findAll(users, condition);
        if (hospitallist && hospitallist.length > 0) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              hospitallist
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
  gethospitallist().then(function () {});
}

function SuperAdminRegister(req, res) {
  async function SuperAdminRegister() {
    try {
      if (req.body && req.body.email && req.body.userType == "subadmin") {
        let condition = {
          email: req.body.email,
        };
        let checkIfUser = await commonQuery.fetch_one(users, condition);

        if (checkIfUser) {
          checkIfUser.password = undefined;
          res.json(
            Response(
              constant.ALLREADY_EXIST,
              constant.USER_ALREADY_EXIST,
              checkIfUser
            )
          );
        } else {
          let registerUser = new users({
            email: req.body.email,
            password: req.body.password,
            previouspassword: null,
            firstName: req.body.firstName,
            userType: req.body.userType,
            phoneNumber: req.body.phoneNumber,
            countryCode: req.body.countryCode,
            hospital_id: mongoose.Types.ObjectId(req.body.hospitalId),
          });

          let register = await commonQuery.InsertIntoCollection(
            users,
            registerUser
          );
          if (register) {
            let link = "https://careportal.curio-dtx.com"


            let imageUrl =
              "https://careportal.curio-dtx.com/upload/0.04706482568753878Logo.png";

            let messageData = {
              email: req.body.email,
              links: link,
              image: imageUrl,
              name: req.body.firstName
            };

            let dataToPassN = {
              subject: "CURIO Subscription",
              message: messageData,
            };

            mailer.sendMailToHospital(req.body.email, dataToPassN);
            register.password = undefined;
            res.json(
              Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, register)
            );
          } else {
            res.json(
              Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
            );
          }
        }
      }
      if (req.body && req.body.email && req.body.userType == "hospital") {
        let condition = {
          email: req.body.email,
        };
        let checkIfUser = await commonQuery.fetch_one(users, condition);

        if (checkIfUser) {
          checkIfUser.password = undefined;
          res.json(
            Response(
              constant.ALLREADY_EXIST,
              constant.USER_ALREADY_EXIST,
              checkIfUser
            )
          );
        } else {
          let registerUser = new users({
            email: req.body.email,
            password: req.body.password,
            previouspassword: null,
            firstName: req.body.firstName,
            userType: req.body.userType,
            profession: req.body.profession,
            phoneNumber: req.body.phoneNumber,
            phoneCountry: req.body.phoneCountry,
            countryCode: req.body.countryCode,
            hospital_id: mongoose.Types.ObjectId(req.body.hospitalId),
            relatedId: mongoose.Types.ObjectId(req.body.relatedId),
          });

          let register = await commonQuery.InsertIntoCollection(
            users,
            registerUser
          );
          if (register) {
            let link = "https://careportal.curio-dtx.com"


            let imageUrl =
              "https://careportal.curio-dtx.com/upload/0.04706482568753878Logo.png";

            let messageData = {
              email: req.body.email,
              links: link,
              image: imageUrl,
              name: req.body.firstName
            };

            let dataToPassN = {
              subject: "CURIO Subscription",
              message: messageData,
            };

            mailer.sendMailToHospital(req.body.email, dataToPassN);
            
            register.password = undefined;
            res.json(
              Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, register)
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
  SuperAdminRegister().then(function () { });
}

function superadminlogin(req, res) {
  async function superadminlogin() {
    try {
      if (req.body && req.body.superadminemail) {
        let condition = {
          email: req.body.superadminemail,
          islive: true,
        };
        let isSuperAdmin;
        let checkIfUser = await commonQuery.fetch_one(users, condition);
        if (checkIfUser && checkIfUser.userType == "subadmin") {
          isSuperAdmin = false;
        }
        if (checkIfUser && checkIfUser.userType == "superadmin") {
          isSuperAdmin = true;
        }
        if (
          checkIfUser &&
          (checkIfUser.userType == "subadmin" ||
            checkIfUser.userType == "superadmin")
        ) {
          checkIfUser.comparePassword(
            req.body.superadminpassword,
            async function (err, isMatch) {
              if (err) {
                console.log("Error");
                res.json(
                  Response(constant.ERROR_CODE, constant.INVALID_LOGIN, err)
                );
              }
              if (isMatch) {
                let params = {
                  _id: checkIfUser._id,
                };

                let token = jwt.sign(params, jwtKey, {
                  expiresIn: "100h",
                });
                checkIfUser.password = undefined;
                let dataToPass = {
                  token: token,
                  isSuperAdmin: isSuperAdmin,
                  user: checkIfUser,
                };
                res.json(
                  Response(
                    constant.SUCCESS_CODE,
                    constant.LOGIN_SUCESS,
                    dataToPass
                  )
                );
              } else {
                res.json(
                  Response(constant.ERROR_CODE, constant.INVALID_LOGIN, err)
                );
              }
            }
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.USER_DOEST_NOT_EXIST, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }
  superadminlogin().then(function () {});
}

function firstFunction(req, res) {
  async function firstFunction() {
    try {
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  firstFunction().then(function () {});
}

function changeUserNotificationPrefrences(req, res) {
  async function changeUserNotificationPrefrences() {
    try {
      if (req.body && req.body.user_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.user_id) };

        let dataToUpdate = {
          isMedicationNotification: req.body.isMedicationNotification,
          isAssessmentNotification: req.body.isAssessmentNotification,
          isAppointmentNotification: req.body.isAppointmentNotification,
        };
        let updateUserPref = await commonQuery.updateOne(
          users,
          condition,
          dataToUpdate
        );
        if (updateUserPref) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              updateUserPref
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  changeUserNotificationPrefrences().then(function () {});
}

function notificationSetting(req, res) {
  async function notificationSetting() {
    try {
      if (req.body && req.body.user_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.user_id) };

        let dataToUpdate = {
          isNotificationAble: req.body.isNotificationAble,
        };
        let updateUserPref = await commonQuery.updateOne(
          users,
          condition,
          dataToUpdate
        );
        if (updateUserPref) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              updateUserPref
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  notificationSetting().then(function () {});
}

function addImage(req, res) {
  //console.log(":A", req.body);
  async function addImage() {
    try {
      if (req.files && req.body) {
        let imagePath = await commonQuery.fileUpload(
          Math.random(new Date()) + req.files["file"]["name"],
          req.files["file"]["data"]
        );
        // console.log("IMAGE PADSTH", imagePath);
        let condition = { _id: mongoose.Types.ObjectId(req.body.patient_id) };
        let dataToUpdate = { image_path: imagePath.url };
        let AddImage = await commonQuery.updateOne(
          users,
          condition,
          dataToUpdate
        );
        if (AddImage) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, AddImage)
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  addImage().then(function () {});
}

function addFamilyHistory(req, res) {
  async function addFamilyHistory() {
    try {
      if (req.body && req.body.user_id) {
        let saveMedicalHistory = new familyhistories({
          diagnosis: req.body.diagnosis,
          ageofdiagnose: req.body.ageofdiagnose,
          note: req.body.note,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          relationship: req.body.relationship,
          dateofbirth: req.body.dateofbirth,
          user_id: req.body.user_id,
        });

        let addMedicatorHistoryData = await commonQuery.InsertIntoCollection(
          familyhistories,
          saveMedicalHistory
        );

        if (addMedicatorHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              addMedicatorHistoryData
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  addFamilyHistory().then(function () {});
}

function addManyFamilyHistory(req, res) {
  async function addManyFamilyHistory() {
    try {
      if (req.body) {
        let addFamily = await commonQuery.InsertManyIntoCollection(
          familyhistories,
          req.body
        );

        if (addFamily) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, null)
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  addManyFamilyHistory().then(function () {});
}

function addImmunizationHistory(req, res) {
  async function addImmunizationHistory() {
    try {
      if (req.body && req.body.user_id) {
        let saveMedicalHistory = new immunizationhistories({
          vaccine: req.body.vaccine,
          date: req.body.date,
          user_id: req.body.user_id,
        });

        let addMedicatorHistoryData = await commonQuery.InsertIntoCollection(
          immunizationhistories,
          saveMedicalHistory
        );

        if (addMedicatorHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              addMedicatorHistoryData
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  addImmunizationHistory().then(function () {});
}

function addManyImmunizationHistory(req, res) {
  console.log("REQ>BO", req.body);
  async function addManyImmunizationHistory() {
    try {
      if (req.body) {
        let addImmune = await commonQuery.InsertManyIntoCollection(
          immunizationhistories,
          req.body
        );
        if (addImmune) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, addImmune)
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  addManyImmunizationHistory().then(function () {});
}

function addMedicationHistory(req, res) {
  async function addMedicationHistory() {
    try {
      if (req.body && req.body.user_id) {
        let saveMedicalHistory = new medicationhistories({
          strength: req.body.strength,
          drug: req.body.drug,
          dose: req.body.dose,
          medicationroute: req.body.medicationroute,
          direction: req.body.direction,
          user_id: req.body.user_id,
        });

        let addMedicatorHistoryData = await commonQuery.InsertIntoCollection(
          medicationhistories,
          saveMedicalHistory
        );

        if (addMedicatorHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              addMedicatorHistoryData
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  addMedicationHistory().then(function () {});
}

function addSocialHistory(req, res) {
  async function addSocialHistory() {
    try {
      if (req.body && req.body.user_id) {
        let saveMedicalHistory = new socialhistories({
          smoking: req.body.smoking,
          travel: req.body.travel,
          drugs: req.body.drugs,
          alcohol: req.body.alcohol,
          tobaco: req.body.tobaco,
          occupation: req.body.occupation,
          user_id: req.body.user_id,
        });

        let addMedicatorHistoryData = await commonQuery.InsertIntoCollection(
          socialhistories,
          saveMedicalHistory
        );

        if (addMedicatorHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              addMedicatorHistoryData
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  addSocialHistory().then(function () {});
}

function addMedicalHistory(req, res) {
  async function addMedicalHistory() {
    try {
      if (req.body && req.body.user_id) {
        let saveMedicalHistory = new medicalhistories({
          diagnosis: req.body.diagnosis,
          ageofdiagnose: req.body.ageofdiagnose,
          note: req.body.note,
          allergies: req.body.allergies,
          user_id: req.body.user_id,
        });

        let addMedicatorHistoryData = await commonQuery.InsertIntoCollection(
          medicalhistories,
          saveMedicalHistory
        );

        if (addMedicatorHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              addMedicatorHistoryData
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  addMedicalHistory().then(function () {});
}

function addAddress(req, res) {
  async function addAddress() {
    try {
      if (req.body && req.body.user_id) {
        let saveAddress = new addresses({
          houseNo: req.body.houseNo,
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          zip: req.body.zip,
          street2: req.body.street2,
        });

        let saveAddressData = await commonQuery.InsertIntoCollection(
          addresses,
          saveAddress
        );
        if (saveAddressData) {
          let address_id = saveAddressData._id;

          let saveUserAddress = new useraddresses({
            address_id: address_id,
            user_id: mongoose.Types.ObjectId(req.body.user_id),
            addressType: req.body.addressType,
          });
          let saveUserAddressData = await commonQuery.InsertIntoCollection(
            useraddresses,
            saveUserAddress
          );
          if (saveUserAddressData) {
          }

          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              saveAddressData
            )
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }
      } else {
        res.json(
          Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
        );
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  addAddress().then(function () {});
}

function registerHospital(req, res) {
  async function registerHospital() {
    try {
      if (req.body && req.body.email) {
        let condition = {
          email: req.body.email,
        };
        let checkIfUser = await commonQuery.fetch_one(users, condition);

        if (checkIfUser) {
          checkIfUser.password = undefined;
          res.json(
            Response(
              constant.ALLREADY_EXIST,
              constant.USER_ALREADY_EXIST,
              checkIfUser
            )
          );
        } else {
          let registerUser = new users({
            email: req.body.email,
            password: req.body.password,
            previouspassword: null,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            gender: req.body.gender,
            profession: req.body.profession,
            phoneNumber: req.body.phoneNumber,
            phoneCountry: req.body.phoneCountry,
            countryCode: req.body.countryCode,
            hospital_id: mongoose.Types.ObjectId(req.body.hospital_id),
            userType: req.body.userType,
          });

          let register = await commonQuery.InsertIntoCollection(
            users,
            registerUser
          );
          if (register) {
            if (req.body.userType != "hospital") {
              resisterToLMS(registerUser);
            }

            register.password = undefined;
            res.json(
              Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, register)
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
  registerHospital().then(function () {});
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
            body && body.data &&
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

function loginHospital(req, res) {
  async function loginHospital() {
    try {
      if (req.body && req.body.email) {
        let condition = { email: req.body.email, islive: true };
        let checkIfUser = await commonQuery.fetch_one(users, condition);
        if (checkIfUser) {
          if (req.body.deviceToken) {
            let updateCondition = { deviceToken: req.body.deviceToken };

            let conditiontocheck = { _id: checkIfUser._id };

            let updateDeviceToken = await commonQuery.updateOne(
              users,
              conditiontocheck,
              updateCondition
            );
            if (updateDeviceToken) {
            }
          }

          checkIfUser.comparePassword(req.body.password, async function (
            err,
            isMatch
          ) {
            if (err) {
              console.log("Error");
              res.json(
                Response(constant.ERROR_CODE, constant.INVALID_LOGIN, err)
              );
            }
            if (isMatch) {
              let params = {
                _id: checkIfUser._id,
              };

              let token = jwt.sign(params, jwtKey, {
                expiresIn: "100h",
              });
              checkIfUser.password = undefined;
              let dataToPass = {
                token: token,
                user: checkIfUser,
              };
              res.json(
                Response(
                  constant.SUCCESS_CODE,
                  constant.LOGIN_SUCESS,
                  dataToPass
                )
              );
            } else {
              res.json(
                Response(constant.ERROR_CODE, constant.INVALID_LOGIN, err)
              );
            }
          });
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.USER_DOEST_NOT_EXIST, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }
  loginHospital().then(function () {});
}

function editUserDetails(req, res) {
  async function editUserDetails() {
    try {
      if (req.body && req.body.user_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.user_id) };

        let dataToUpdate = {
          firstName: req.body.firstName,
          middleName: req.body.middleName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
        };

        let updateUserDetail = await commonQuery.updateOne(
          users,
          condition,
          dataToUpdate
        );

        if (updateUserDetail) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              updateUserDetail
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

  editUserDetails().then(function () {});
}

function deleteUser(req, res) {
  async function deleteUser() {
    try {
      if (req.body && req.body.user_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.user_id) };

        let dataToUpdate = {
          islive: false,
        };

        let deleteUSerData = await commonQuery.updateOne(
          users,
          condition,
          dataToUpdate
        );

        if (deleteUSerData) {
          lmsDeleteUser(condition);
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.DELETE_SUCCESS,
              deleteUSerData
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

  deleteUser().then(function () {});
}

async function lmsDeleteUser(condition) {
  let lmsUser = await commonQuery.findoneData(users, condition);
  let authorizationToken = await commonQuery.findoneData(adobeModel);

  if (lmsUser.userLMS_id && authorizationToken.access_token) {
    let deletelmsUri = urlLmsV2 + "/users/" + lmsUser.userLMS_id;
    request(
      {
        headers: {
          "Content-Type": "application/vnd.api+json;charset=UTF-8",
          Authorization: authorizationToken.access_token,
          Accept: "application/vnd.api+json",
        },
        uri: deletelmsUri,
        method: "DELETE",
      },
      function (error, response, body) {
        // if (response.statusCode == 204) {
        //   let findCond = {
        //     user_id: toFindUser,
        //     hospital_id: mongoose.Types.ObjectId(JSON.parse(JSON.stringify(programInfo.hospital_user_id)))
        //   }
        //   let updateCond = {
        //     userLMS_id:null
        //   }
        //   commonQuery.updateOneDocument(users, condition,updateCond)
        // }
        if (error) {
          console.log("Error in lmsProgram");
        }
      }
    );
  }
  console.log();
}

function getUserDetails(req, res) {
  async function getUserDetails() {
    try {
      if (req.body && req.body.user_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.user_id) };

        let userData = await commonQuery.findoneData(users, condition);

        if (userData) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, userData)
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

  getUserDetails().then(function () {});
}

function updateFamilyHistory(req, res) {
  async function updateFamilyHistory() {
    try {
      if (req.body && req.body._id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body._id) };
        let updateCondition = {
          diagnosis: req.body.diagnosis,
          ageofdiagnose: req.body.ageofdiagnose,
          note: req.body.note,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          relationship: req.body.relationship,
          dateofbirth: req.body.dateofbirth,
        };

        let addMedicatorHistoryData = await commonQuery.updateOne(
          familyhistories,
          condition,
          updateCondition
        );

        if (addMedicatorHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              addMedicatorHistoryData
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  updateFamilyHistory().then(function () {});
}

function updateImmunizationHistory(req, res) {
  async function updateImmunizationHistory() {
    try {
      if (req.body && req.body._id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body._id) };
        let updateCondition = {
          vaccine: req.body.vaccine,
          date: req.body.date,
        };

        let addMedicatorHistoryData = await commonQuery.updateOne(
          immunizationhistories,
          condition,
          updateCondition
        );

        if (addMedicatorHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              addMedicatorHistoryData
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  updateImmunizationHistory().then(function () {});
}
function updateMedicationHistory(req, res) {
  async function updateMedicationHistory() {
    try {
      if (req.body && req.body._id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body._id) };
        let updateCondition = {
          strength: req.body.strength,
          drug: req.body.drug,
          dose: req.body.dose,
          medicationroute: req.body.medicationroute,
          direction: req.body.direction,
        };

        let addMedicatorHistoryData = await commonQuery.updateOne(
          medicationhistories,
          condition,
          updateCondition
        );

        if (addMedicatorHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              addMedicatorHistoryData
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  updateMedicationHistory().then(function () {});
}
function checkUserData(req, res) {
  async function checkUserData() {
    try {
      if (req.body.type === "data") {
        users.remove({}, function (err, result) {
          if (err) {
            res.json(
              Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, err)
            );
          } else {
            res.json(
              Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, result)
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
  checkUserData().then(function () {});
}

function updateSocialHistory(req, res) {
  async function updateSocialHistory() {
    try {
      if (req.body && req.body._id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body._id) };
        let updateCondition = {
          smoking: req.body.smoking,
          travel: req.body.travel,
          drugs: req.body.drugs,
          alcohol: req.body.alcohol,
          tobaco: req.body.tobaco,
          occupation: req.body.occupation,
        };

        let addMedicatorHistoryData = await commonQuery.updateOne(
          socialhistories,
          condition,
          updateCondition
        );

        if (addMedicatorHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              addMedicatorHistoryData
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  updateSocialHistory().then(function () {});
}

function updateMedicalHistory(req, res) {
  console.log("REQ", req.body);
  async function updateMedicalHistory() {
    try {
      if (req.body && req.body._id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body._id) };
        let updateCondition = {
          diagnosis: req.body.diagnosis,
          ageofdiagnose: req.body.ageofdiagnose,
          note: req.body.note,
          allergies: req.body.allergies,
        };

        let addMedicatorHistoryData = await commonQuery.updateOne(
          medicalhistories,
          condition,
          updateCondition
        );

        if (addMedicatorHistoryData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              addMedicatorHistoryData
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  updateMedicalHistory().then(function () {});
}

function changePassword(req, res) {
  async function changePassword() {
    try {
      if (req.body && req.body._id) {
        users.findById(mongoose.Types.ObjectId(req.body._id), function (
          err,
          result
        ) {
          if (err) {
            res.json(
              Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
            );
          } else {
            result.password = req.body.password;

            result.save();

            res.json(
              Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, result)
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

  changePassword().then(function () {});
}
