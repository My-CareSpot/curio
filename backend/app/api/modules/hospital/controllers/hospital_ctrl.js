"use strict";

const mongoose = require("mongoose");
const utility = require("../../../../lib/utility.js");
const request = require("request");

const jwt = require("jsonwebtoken");

var FCM = require("fcm-node");
var serverKey =
  "AAAAIT8W-_g:APA91bGg9Pd4zQhtGWwCWVPKfO13R_mrzpw9cts3Qi--Mck3pk_SCsDqSYAZOQOM9xaFJOFRzR_iO0y4Ut6gYI9_ygxkzMOAn9gK4bt8rtVsDTyano0e4djbyEdu9wm4EbiKMB-8GrhG";
var fcm = new FCM(serverKey);

const jwtKey = "saloncrm";

const expiry = "100h";
const countryData = require("country-data").countries;
const constant = require("../../../../config/constant.js");
const specializations = require("../model/specialization_schema");
const cron = require("node-cron");

const videonotifications = require("../../video/models/videocallnotification_schema");

const hospitalsettings = require("../model/hospital_setting");

const userHobbies = require("../model/userhobbies_schema");

const responses = require("../model/ssresponse_schema");

const moment = require("moment-timezone");

const motivations = require("../model/motivation_schema");

const programs = require("../model/program_schema");
const symptoms = require("../model/symptoms_schema");
const sideeffects = require("../model/sideeffect_schema");

const notifications = require("../model/notification_schema");

const caretakers = require("../model/caretaker_schema");
const appointmentrequests = require("../model/appointmentrequest_schema");
const caretakerhospitals = require("../model/caretakerhospital_schema");
const caretakerspecializations = require("../model/caretakerspecialization_schema");

const users = require("../../user/model/userSchema");

const bookings = require("../model/booking_schema");

const Response = require("../../../../lib/response_handler.js");
const hospitals = require("../model/hospital_schema");
const patients = require("../../patient/model/patient_schema");
const hobbies = require("../model/hobbies_schema");
const medicines = require("../model/medicines_schema");
const dosages = require("../../patient/model/dosage_schema");
const availability = require("../../hospital/model/availability_model");
const validator = require("../../../../config/validator.js");
const Config = require("../../../../config/config").get(
  process.env.NODE_ENV || "local"
);
const commonQuery = require("../../../../lib/commonQuery.js");
const adobeModel = require("../model/adobe_schema");
const courseModel = require("../model/course_schema");
const usercourses = require("../model/usercourse_schema");
const assessmentListModel = require("../model/assessmentlist_schema");
const questionModel = require("../model/question_schema");
const patientAssessmentModel = require("../model/patientassessment_schema");
const urlLmsV2 = "https://captivateprime.adobe.com/primeapi/v2";
const qs = require("querystring");
const lmspoints = require("../model/playlistpoint_schema");

const journalListModel = require("../model/journallist_schema");
const journalQuestionModel = require("../model/journalquestion_schema");
const patientJournalModel = require("../model/patientjournal_schema");

module.exports = {
  firstFunction: firstFunction,
  saveHospital: saveHospital,
  addHobbies: addHobbies,
  getHobbies: getHobbies,
  addMedicines: addMedicines,
  addDosage: addDosage,
  getDosages: getDosages,
  getPatients: getPatients,
  addSepcialization: addSepcialization,
  addCareTaker: addCareTaker,
  getSpecialization: getSpecialization,
  getCareTaker: getCareTaker,
  addAvailability: addAvailability,
  assignCareTaker: assignCareTaker,
  getCareTeamOfPatient: getCareTeamOfPatient,
  setAvailability: setAvailability,
  getAvailability: getAvailability,
  deleteProgram: deleteProgram,
  //getSpecialistAppointment: getSpecialistAppointment
  requestAppointment: requestAppointment,
  getAppointmentRequest: getAppointmentRequest,
  sendAutoReminder: sendAutoReminder,
  addNotification: addNotification,
  getNotification: getNotification,
  bookAppointment: bookAppointment,
  getCareTakerAppointments: getCareTakerAppointments,
  getPatientAppointments: getPatientAppointments,
  getCompletedPatientAppointments: getCompletedPatientAppointments,
  getCareTakerCompletedAppointments: getCareTakerCompletedAppointments,
  getMedicine: getMedicine,
  getCareTakerAvailibility: getCareTakerAvailibility,
  appointRequestIdCreator: appointRequestIdCreator,
  getPatientDetails: getPatientDetails,
  getMedicationReminders: getMedicationReminders,
  patientPendingRequest: patientPendingRequest,
  patientAcceptedRequest: patientAcceptedRequest,
  getIndividualCareTakerAppointments: getIndividualCareTakerAppointments,
  readNotification: readNotification,
  editCareTakerDetail: editCareTakerDetail,
  getSymptpmsAndSideEffects: getSymptpmsAndSideEffects,
  deleteCareTaker: deleteCareTaker,
  unassignCareTaker: unassignCareTaker,
  playList: playList,
  addProgram: addProgram,
  activitylist: activitylist,
  getPrograms: getPrograms,
  updateProgram: updateProgram,
  selectHobbies: selectHobbies,
  updateTimingSetting: updateTimingSetting,
  respondOfSymptoms: respondOfSymptoms,
  sendMotivations: sendMotivations,
  addSymptoms: addSymptoms,
  addSideEffect: addSideEffect,
  addAssessmentQues: addAssessmentQues,
  saveQuestionList: saveQuestionList,
  getUserQuestionInfo: getUserQuestionInfo,
  getAllAssessment: getAllAssessment,
  deleteAssessment: deleteAssessment,
  getAllAssessmentMobile: getAllAssessmentMobile,
  getAssessmentQuestion: getAssessmentQuestion,
  savePatientAssessment: savePatientAssessment,
  getSymptom: getSymptom,
  getSideEffect: getSideEffect,
  updateSymptom: updateSymptom,
  deleteSymptom: deleteSymptom,
  updateSideEffect: updateSideEffect,
  deleteSideEffect: deleteSideEffect,
  saveHospitalAssessment: saveHospitalAssessment,
  showHospitalAssessment: showHospitalAssessment,
  getMonthlySymptomSideEffectAnalysis: getMonthlySymptomSideEffectAnalysis,
  hospitalTimingSettings: hospitalTimingSettings,
  getHospitalTiming: getHospitalTiming,
  getCareTakerOfHospitals: getCareTakerOfHospitals,
  assignPatientToProgram: assignPatientToProgram,
  getMotivationList: getMotivationList,
  cancelAppointmentRequest: cancelAppointmentRequest,
  getAssignedAssessment: getAssignedAssessment,
  getAssignedQuestion: getAssignedQuestion,
  getVideoCallNotifications: getVideoCallNotifications,
  markVideoNotificationAsRead: markVideoNotificationAsRead,
  getPatientSearch: getPatientSearch,
  getPlaylistPoint: getPlaylistPoint,
  saveJournalList: saveJournalList,
  getAllJournal: getAllJournal,
  addJournalQues: addJournalQues,
  getUserJournalQuestionList: getUserJournalQuestionList,
  deleteJournal: deleteJournal,
  showHospitalJournal: showHospitalJournal,
  saveHospitalJournal: saveHospitalJournal,
  getAssignedJournal: getAssignedJournal,
  getAllJournalMobile: getAllJournalMobile,
  savePatientJournal: savePatientJournal,
  getJournalQuestion: getJournalQuestion,
  getAssignedJournalQuestion: getAssignedJournalQuestion,
  getCareTakerAvailibilities: getCareTakerAvailibilities,
  uploadImg:uploadImg,
  assignJournalToProgram:assignJournalToProgram,
  getJournalLists:getJournalLists,
};

function getJournalLists(req, res) {
  async function getJournalLists() {
    try {
      if (req.body && req.body.user_id) {
        let journalInfo = await users.aggregate([
          {$match:{"_id" :mongoose.Types.ObjectId(req.body.user_id),"userType" : "patient"}},
          {
              $lookup:{
          
                      from: "programs",     
                      let:{hospital_id:"$hospital_id",patient_id:"$_id"},
                      pipeline:[
                      {$match:{$expr:{$in:["$$patient_id","$connected_user_id"]}}}           
                      
                      ],
                      as:"journalList"
              
                  }    
          },
          {$unwind:"$journalList"},
          {$project:{
              journalIds:"$journalList.journal_assigned_ids"    
          }},
          {
              $group: { 
                  "_id": null,
                  "journalIds": { $push: "$journalIds"} 
              }
          },
          {
                  $project: {
                      _id: 1,
                      journalIds: {
                          $reduce: {
                              input: "$journalIds",
                              initialValue: [],
                              in: {
                                  $concatArrays: [ "$$this", "$$value"]
                              }
                          }
                      }
                  }
          },
          {$unwind:"$journalIds"},
          {
                  $group: {
                      _id: '$_id', 
                      journalIds: {
                          $addToSet: '$journalIds'
                      }
                  }
          },
          {
              $lookup:{
                  from:"journallists",
                  localField: "journalIds",
                  foreignField: "_id",
                  as: "journalInfo"
                  }
          },
          {
              $project:{journalInfo:1}
          }
          ]).exec(async (err, result) => {
                if (err) {
                  console.log("ERROR", err);
                  res.json(
                    Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, err)
                  );
                } else {              
                  res.json(
                    Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, result[0].journalInfo)
                  );
                }
              })
       }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }

  getJournalLists().then(function () {});
}

function assignJournalToProgram(req, res) {
  async function assignJournalToProgram() {
    try {
      if (req.body) {
        let journalIds = [];

        let _id = mongoose.Types.ObjectId(req.body.program_id);

        req.body.journal_ids.forEach(function (n) {
          journalIds.push(mongoose.Types.ObjectId(n));
        });

        await programs
          .findByIdAndUpdate(
            _id,
            { $set: {journal_assigned_ids: journalIds } },
            { safe: true, upsert: true }
          )
          .exec(async (err, result) => {
            if (err) {
              console.log("ERROR", err);
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

  assignJournalToProgram().then(function () {});
}

function uploadImg(req, res) {
  async function uploadImg() {
    try {
      if (req.files) {
        let imagePath = await commonQuery.fileUpload(
          Math.random(new Date()) +req.files["file"]["name"],
          req.files["file"]["data"]
        );
        if (imagePath.status) {
          
          if (imagePath) {
            res.json(
              Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS,imagePath)
            );
          }

        }
        else {
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
  uploadImg().then(function () { });
}

function getAssignedJournalQuestion(req, res) {
  async function getAssignedJournalQuestion() {
    try {
      if (req.body.user_id && req.body.journal_id) {
        let queryData = await patientJournalModel
          .aggregate([
            {
              $match: {
                journal_id: mongoose.Types.ObjectId(req.body.journal_id),
                user_id: mongoose.Types.ObjectId(req.body.user_id),
              },
            },
            {
              $lookup: {
                from: "journalquestionlists",
                localField: "question_id",
                foreignField: "_id",
                as: "questionInfo",
              },
            },
          ])
          .exec();

        if (queryData && queryData.length > 0) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, queryData)
          );
        } else {
          res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
        }
      }
    } catch (error) {
      console.log("Error in getAssignedJournalQuestion");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  getAssignedJournalQuestion().then((response) => {});
}

function getJournalQuestion(req, res) {
  async function getJournalQuestionMethod() {
    try {
      if (req.body.journal_id) {
        let { journal_id, user_id } = req.body;
        let condObj = {
          journal_id,
          isDeleted: false,
        };
        let questionList = await commonQuery.findPatientJournalQuestion(
          journalQuestionModel,
          journal_id,
          user_id
        );
        if (questionList.length > 0) {
          questionList.forEach((eachObj) => {
            if (eachObj.data && eachObj.data.length > 0) {
              let originalquestionList = eachObj.options;
              let savequestionList = eachObj.data[0].options;
              originalquestionList.map((x) => {
                if (eachObj.journalType == "text") {
                  eachObj.textAns = eachObj.data[0].textAns;
                  if (eachObj.typeOfjournal == "Screening") {
                    eachObj.totalPointEarned = eachObj.data[0].totalPointEarned;
                  }
                }
                if (eachObj.journalType != "text") {
                  if (eachObj.typeOfjournal == "Screening") {
                    eachObj.totalPointEarned = eachObj.data[0].totalPointEarned;
                  }
                  savequestionList.forEach((y) => {
                    if (JSON.stringify(y._id) == JSON.stringify(x._id)) {
                      x.status = true;
                      eachObj.saved = true;
                    }
                  });
                }
              });
              delete eachObj.data;
            }
          });
        }
        if (questionList.length >= 0) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              questionList
            )
          );
        }
      } else {
        res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
      }
    } catch (error) {
      console.log("getJournalQuestion error");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  getJournalQuestionMethod().then(function (params) {});
}

function savePatientJournal(req, res) {
  async function savePatientJournal() {
    try {
      if (req.body.length > 0) {
        let arrayObj = req.body;

        for (let eachObj of arrayObj) {
          if (eachObj.user_id && eachObj.question_id) {
            let {
              user_id,
              question_id,
              journal_id,
              options,
              textAns,
            } = eachObj;
            let saveObj;
            let updateCond;
            if (options && options.length > 0) {
              saveObj = {
                options,
              };
              updateCond = {
                user_id,
                question_id,
                journal_id,
              };
            }
            if (textAns) {
              saveObj = {
                textAns,
              };
              updateCond = {
                user_id,
                question_id,
                journal_id,
              };
            }
            let saveData = await commonQuery.updateAndUpsert(
              patientJournalModel,
              updateCond,
              saveObj
            );
          }
        }
        res.json(Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS));
      }
    } catch (error) {
      console.log("Error in savePatientJournal");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  savePatientJournal().then((response) => {});
}

function getAllJournalMobile(req, res) {
  async function getAllJournalMobile_Method() {
    try {
      if (req.body.user_id) {
        let user_id = req.body.user_id;
        let data = await commonQuery.getJournalId(patients, user_id);
        if (data.length > 0) {
          // let dataRes = data[0].journal_info;
          let newData = [];

          for (let x of data) {
            let journalInfo = x.journal_info;
            if (x.questionInfo && x.questionInfo.length > 0) {
              journalInfo.status = "Completed";
            } else {
              journalInfo.status = "Pending";
            }
            if (!journalInfo.isDeleted) {
              if (
                req.body.search_txt == "" ||
                req.body.search_txt == null ||
                req.body.search_txt == "undefined"
              ) {
                newData.push(journalInfo);
              } else {
                var regex = new RegExp(req.body.search_txt, "i");
                let found = journalInfo.name.match(regex);
                if (found != null && found.length > 0) {
                  newData.push(journalInfo);
                }
              }
            }
          }
          res.json(
            Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, newData)
          );
        } else {
          res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
        }
      } else {
        res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
      }
    } catch (error) {
      console.log("getAllJournalMobile error");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  getAllJournalMobile_Method().then(function (params) {});
}

function getAssignedJournal(req, res) {
  async function getAssignedJournal() {
    try {
      let rawjournal = await patients
        .aggregate([
          { $match: { user_id: mongoose.Types.ObjectId(req.body.user_id) } },

          {
            $lookup: {
              from: "journallists",
              let: { journal_id: "$journal_id" },
              pipeline: [
                { $match: { $expr: { $and: [{ isDeleted: false }] } } },
                { $match: { $expr: { $in: ["$_id", "$$journal_id"] } } },
              ],
              as: "journalInfo",
            },
          },
          {
            $unwind: {
              path: "$journalInfo",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "journalquestionlists",
              let: { assesst: "$journalInfo._id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$isDeleted", false] },
                        { $eq: ["$journal_id", "$$assesst"] },
                      ],
                    },
                  },
                },
              ],
              as: "questionInfo",
            },
          },
          {
            $unwind: {
              path: "$questionInfo",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "patientjournals",
              let: {
                journalId: "$journalInfo._id",
                userId: "$user_id",
                questionId: "$questionInfo._id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$user_id", "$$userId"] },
                        { $eq: ["$journal_id", "$$journalId"] },
                        { $eq: ["$question_id", "$$questionId"] },
                      ],
                    },
                  },
                },
              ],
              as: "patientjournalInfo",
            },
          },
          {
            $project: {
              user_id: 1,
              patientjournalInfo: 1,
              journalId: "$journalInfo._id",
              journalName: "$journalInfo.name",
              journalType: "$journalInfo.journal_type",
              questionId: "$questionInfo._id",
              questionOpt: "$questionInfo.options",
            },
          },
          {
            $group: {
              _id: {
                journalId: "$journalId",
                journalType: "$journalType",
              },
              journalId: { $first: "$journalId" },
              user_id: { $first: "$journalId" },
              journalName: { $first: "$journalName" },
              journalType: { $first: "$journalType" },
              questionDet: {
                $push: {
                  patientjournalInfo: "$patientjournalInfo",
                  questionId: "$questionId",
                  questionOpt: "$questionOpt",
                },
              },
            },
          },
        ])
        .exec();

      if (rawjournal.length > 0) {
        let patientjournalArray = [];
        for (let x of rawjournal) {
          if (x.journalName != null) {
            let eachAssesstment = {
              name: x.journalName,
              journal_type: x.journalType,
              journalId: x.journalId,
            };
            let totalCount = 0;
            for (let y of x.questionDet) {
              if (y.patientjournalInfo && y.patientjournalInfo.length > 0) {
                y.questionOpt.map((obj) => {
                  y.patientjournalInfo.map((patientObj) => {
                    if (
                      patientObj &&
                      patientObj.textAns &&
                      x.journalType == "Screening"
                    ) {
                      totalCount = totalCount + obj.optionPoint;
                      eachAssesstment.status = "completed";
                    } else if (
                      patientObj &&
                      patientObj.textAns &&
                      x.journalType == "Normal"
                    ) {
                      eachAssesstment.status = "completed";
                    } else {
                      patientObj.options.filter((inrObj) => {
                        if (
                          JSON.parse(JSON.stringify(obj._id)) ==
                            JSON.parse(JSON.stringify(inrObj._id)) &&
                          x.journalType == "Screening"
                        ) {
                          totalCount = totalCount + obj.optionPoint;
                          eachAssesstment.status = "completed";
                        }
                        if (
                          JSON.parse(JSON.stringify(obj._id)) ==
                            JSON.parse(JSON.stringify(inrObj._id)) &&
                          x.journalType == "Normal"
                        ) {
                          if (eachAssesstment.status == undefined) {
                            eachAssesstment.status = "completed";
                          }
                        }
                      });
                    }
                  });
                });
              } else {
                if (eachAssesstment.status == undefined) {
                  eachAssesstment.status = "pending";
                }
              }
              eachAssesstment.totalCount = totalCount;
            }
            patientjournalArray.push(eachAssesstment);
          }
        }
        res.json(
          Response(
            constant.SUCCESS_CODE,
            constant.UPDATE_SUCCESS,
            patientjournalArray
          )
        );
      }
    } catch (error) {
      console.log("Error in getAssignedJournal");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  getAssignedJournal().then((response) => {});
}

function saveHospitalJournal(req, res) {
  async function saveHospitalJournal() {
    try {
      if (req.body.hospital_id) {
        let { hospital_id, inputData } = req.body;
        let userId = inputData.patientName;
        let journalId = inputData.journalId;

        let value = await commonQuery.setJournalArray(
          patients,
          hospital_id,
          userId,
          journalId
        );
        if (value.ok) {
          res.json(Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS));
        }
      }
    } catch (error) {
      console.log("saveHospitalJournal error");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  saveHospitalJournal().then((res) => {});
}

function showHospitalJournal(req, res) {
  async function showHospitalJournal() {
    try {
      if (req.body.hospital_id) {
        let data = await commonQuery.fetch_all_journal_populate(
          patients,
          req.body.hospital_id,
          "",
          "",
          "journal_id"
        );
        res.json(
          Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, data)
        );
      }
    } catch (error) {
      console.log("Error in showHospitalJournal");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  showHospitalJournal().then((response) => {});
}

function deleteJournal(req, res) {
  async function deleteJournal() {
    try {
      let { user_id, data, type } = req.body;
      if (user_id) {
        if (type == "journal") {
          let obj = {
            user_id: mongoose.Types.ObjectId(user_id),
            _id: mongoose.Types.ObjectId(data),
          };
          let updateData = {
            isDeleted: true,
          };
          let result = await commonQuery.updateOneDocument(
            journalListModel,
            obj,
            updateData
          );
          if (result._id) {
            res.json(Response(constant.SUCCESS_CODE, constant.DELETE_SUCCESS));
          } else {
            res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
          }
        } else {
          if (type == "question") {
            let obj = {
              _id: mongoose.Types.ObjectId(data),
            };
            let updateData = {
              isDeleted: true,
            };
            let result = await commonQuery.updateOneDocument(
              journalQuestionModel,
              obj,
              updateData
            );
            if (result.isDeleted) {
              res.json(
                Response(constant.SUCCESS_CODE, constant.DELETE_SUCCESS)
              );
            } else {
              res.json(
                Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS)
              );
            }
          }
        }
      }
    } catch (error) {
      console.log("Error in deleteJournal");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  deleteJournal().then((response) => {});
}

function getUserJournalQuestionList(req, res) {
  async function getUserJournalQuestionListMethod() {
    const action = req.body.action;
    const journal_id = req.body.journal_id;
    const user_id = req.body.user_id;
    const filterValue =
      req.body.filterValue && req.body.filterValue.value
        ? req.body.filterValue.value
        : "";
    try {
      let count = req.body.pageSize ? parseInt(req.body.pageSize) : 20;
      let skip = 0;
      if (req.body.pageSize && req.body.pageIndex) {
        skip = req.body.pageSize * req.body.pageIndex;
      }
      const sort = { createdAt: -1 };
      let cond = {};
      let searchText = decodeURIComponent(filterValue).replace(
        /[[\]{}()*+?,\\^$|#\s]/g,
        "\\s+"
      );

      if (filterValue) {
        cond.$or = [
          { surveyType: new RegExp(searchText, "gi") },
          { question: new RegExp(searchText, "gi") },
        ];
      }
      if (action == "question") {
        cond.journal_id = mongoose.Types.ObjectId(journal_id);
        cond.user_id = mongoose.Types.ObjectId(user_id);
        cond.isDeleted = false;
        let questionList = await commonQuery.findDataBySortSkipLimit(
          journalQuestionModel,
          cond,
          sort,
          count,
          skip
        );
        if (questionList.status) {
          journalQuestionModel.count(cond).exec((err, count) => {
            if (!err) {
              let dataObj = {
                data: questionList.data,
                totalCount: count,
              };
              res.json(
                Response(
                  constant.SUCCESS_CODE,
                  constant.UPDATE_SUCCESS,
                  dataObj
                )
              );
            }
          });
        }
      } else {
        res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
      }
    } catch (error) {
      console.log("getUserJournalQuestionList error");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  getUserJournalQuestionListMethod().then(function (params) {});
}

function addJournalQues(req, res) {
  async function addJournalQues() {
    try {
      let {
        user_id,
        question,
        journal_id,
        journalType,
        options,
        perform,
        userId,
        question_id,
        optionValue,
        typeOfjournal,
        textPoint,
        oldImage,
        convertedUrl,
        imgName
      } = req.body.AllQuestionForm.questions[0];
      if (journalType == "text") {
        options = [{ optionValue: "text" }];
      }
      if (journalType == "text" && typeOfjournal == "Screening") {
        options = [{ optionValue: "text", optionPoint: textPoint }];
      }

      if (user_id || userId) {
        if (perform == "update") {
          let updateCond = {
            question: question,
            options: optionValue,
          };
          if(imgName){
           if(oldImage){await commonQuery.fileDelete(oldImage);}
          
            updateCond.imgName = imgName;
            updateCond.convertedUrl = convertedUrl;

          }
          
          let findCond = {
            _id: mongoose.Types.ObjectId(question_id),
          };
          let updateQuestion = await commonQuery.updateOneDocument(
            journalQuestionModel,
            findCond,
            updateCond
          );
          if (updateQuestion.journalType) {
            res.json(Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS));
          } else {
            res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
          }
        } else {
          let saveObj = {
            user_id,
            journal_id,
            journalType,
            question,
            options,
            typeOfjournal,
            imgName:req.body.imgName,
            convertedUrl :req.body.convertedUrl
          };
          let addSurveyData = await commonQuery.InsertManyIntoCollection(
            journalQuestionModel,
            saveObj
          );

          if (addSurveyData.length > 0) {
            res.json(Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS));
          } else {
            res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
          }
        }
      } else {
        res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
      }
    } catch (error) {
      console.log("error in addJournalQues");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  addJournalQues().then((response) => {});
}

function saveJournalList(req, res) {
  async function saveJournalList_method() {
    try {
      const { user_id, name, assessment_type } = req.body;

      const saveObj = {
        user_id: user_id,
        fromData: moment().utc().format(),
        toDate: moment().utc().format(),
        name: name,
        journal_type: assessment_type,
      };

      const saveJournalListData = await commonQuery.InsertIntoCollection(
        journalListModel,
        saveObj
      );

      if (saveJournalListData.id) {
        res.json(Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS));
      } else {
        res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
      }
    } catch (error) {
      console.log("error in saveJournalList");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  saveJournalList_method().then(function (data) {});
}

function getAllJournal(req, res) {
  async function getAllJournal_Method() {
    const filterValue =
      req.body.filterValue && req.body.filterValue.value
        ? req.body.filterValue.value
        : "";

    try {
      let count =
        req.body.paginate && req.body.paginate.pageSize
          ? parseInt(req.body.paginate.pageSize)
          : 20;
      let skip = 0;
      if (
        req.body.paginate &&
        req.body.paginate.pageSize &&
        req.body.paginate.pageIndex
      ) {
        skip = req.body.paginate.pageSize * req.body.paginate.pageIndex;
      }

      var sortObject = { updatedAt: -1 };
      // if (req.body.sort.active && req.body.sort.direction) {
      //     sortObject[req.body.sort.active] = req.body.sort.direction;
      // } else {
      //     sortObject = {updatedAt:-1 }
      // }
      const sort = sortObject;
      const { cond } = req.body;
      let searchText = decodeURIComponent(filterValue).replace(
        /[[\]{}()*+?,\\^$|#\s]/g,
        "\\s+"
      );
      if (filterValue) {
        cond.$or = [
          { fromDate: new RegExp(searchText, "gi") },
          { name: new RegExp(searchText, "gi") },
          { toDate: new RegExp(searchText, "gi") },
        ];
      }
      let QuestionList = await commonQuery.findDataBySortSkipLimit(
        journalListModel,
        cond,
        sort,
        count,
        skip
      );

      if (QuestionList.status) {
        journalListModel.count(cond).exec((err, count) => {
          if (count >= 0) {
            let dataObj = {
              data: QuestionList.data,
              totalCount: count,
            };
            res.json(
              Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, dataObj)
            );
          }
        });
      }
    } catch (error) {
      console.log("getAllJournal error");
      res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
    }
  }
  getAllJournal_Method().then(function (params) {});
}

function getPlaylistPoint(req, res) {
  async function getPlaylistPoint() {
    try {
      if (req.body.request_for && req.body.user_id) {
        let skip = req.body.page ? req.body.page * req.body.limit : 0;
        let limit = req.body.limit ? req.body.limit : 10;
        let data;
        if (req.body.request_for == "day") {
          //request for should keyword as "day","week","month"
          data = await getdayresult(req, skip, limit);
        }
        if (req.body.request_for == "week") {
          data = await getweekresult(req, skip, limit);
        }
        if (req.body.request_for == "month") {
          data = await getmonthresult(req, skip, limit);
        }
        if (data) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, data)
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }
      } else {
        res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
      }
    } catch (err) {
      console.log("Error in getPlaylistPoint");
    }
  }
  getPlaylistPoint().then((response) => {});
}

async function getmonthresult(req, skip, limit) {
  let data = await lmspoints
    .aggregate([
      {
        $match: { user_id: mongoose.Types.ObjectId(req.body.user_id) },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          pointEarned: { $sum: "$point_earned" },
          monthTotal: { $sum: "$total_point" },
        },
      },
      { $sort: { _id: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalNumber: [{ $count: "monthTotal" }],
          totalCount: [
            {
              $group: { _id: null, count: { $sum: "$pointEarned" } },
            },
          ],
        },
      },
    ])
    .exec();

  if (data && data[0] && data[0].data && data[0].data.length > 0) {
    data[0].data.map((x) => {
      var year = x._id.year;
      var month = x._id.month - 1;
      var firstDay = new Date(year, month, 1);
      var lastDay = new Date(year, month + 1, 0);
      x.startMonth = firstDay;
      x.endMonth = lastDay;
      delete x._id;
    });
  }
  data[0].numberOfCount = data[0].totalNumber[0].weekTotal;
  data[0].totalPoints = data[0].totalCount[0].count;
  delete data[0].totalNumber;
  delete data[0].totalCount;
  return data;
}

async function getdayresult(req, skip, limit) {
  let data = await lmspoints
    .aggregate([
      {
        $match: { user_id: mongoose.Types.ObjectId(req.body.user_id) },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: 0 },
            { $limit: 10 },
            {
              $project: {
                pointEarned: "$point_earned",
                dayTotal: "$total_point",
                date: "$createdAt",
              },
            },
          ],
          totalNumber: [{ $count: "total_point" }],
          totalCount: [
            {
              $group: { _id: null, count: { $sum: "$pointEarned" } },
            },
          ],
        },
      },
    ])
    .exec();

  if (data && data[0] && data[0].data && data[0].data.length > 0) {
    data[0].numberOfCount = data[0].totalNumber[0].total_point;
    data[0].totalPoints = data[0].totalCount[0].count;

    delete data[0].totalNumber;
    delete data[0].totalCount;
    return data;
  }
}

async function getweekresult(req, skip, limit) {
  let data = await lmspoints
    .aggregate([
      {
        $match: { user_id: mongoose.Types.ObjectId(req.body.user_id) },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
          },
          pointEarned: { $sum: "$point_earned" },
          weekTotal: { $sum: "$total_point" },
        },
      },
      { $sort: { _id: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalNumber: [{ $count: "weekTotal" }],
          totalCount: [
            {
              $group: { _id: null, count: { $sum: "$pointEarned" } },
            },
          ],
        },
      },
    ])
    .exec();

  if (data && data[0] && data[0].data && data[0].data.length > 0) {
    data[0].data.map((x) => {
      var year = x._id.year;
      var week = x._id.week;
      let firstDay = new Date(year, 0, 1).getDay();
      var d = new Date("Jan 01, " + year + " 01:00:00");
      var w = d.getTime() - 3600000 * 24 * (firstDay - 1) + 604800000 * week;
      var n1 = new Date(w);
      var n2 = new Date(w + 518400000);
      delete x._id;
      x.startWeek = n1;
      x.endWeek = n2;
    });
  }
  data[0].numberOfCount = data[0].totalNumber[0].weekTotal;
  data[0].totalPoints = data[0].totalCount[0].count;
  delete data[0].totalNumber;
  delete data[0].totalCount;
  return data;
}

function markVideoNotificationAsRead(req, res) {
  async function markVideoNotificationAsRead() {
    try {
      if (req.body && req.body._id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body._id) };

        let dataToUpdate = { isActive: false, isDeleted: true };

        let markRead = await commonQuery.updateOne(
          videonotifications,
          condition,
          dataToUpdate
        );

        if (markRead) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, markRead)
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.SUCCESS_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }
  markVideoNotificationAsRead().then(function () {});
}

function getVideoCallNotifications(req, res) {
  async function getVideoCallNotifications() {
    try {
      if (req.body && req.body.hospital_user_id) {
        let condition = {
          hospital_user_id: mongoose.Types.ObjectId(req.body.hospital_user_id),
          isActive: true,
          isDeleted: false,
        };

        let count = await commonQuery.findCount(videonotifications, condition);

        videonotifications
          .find({
            hospital_user_id: mongoose.Types.ObjectId(
              req.body.hospital_user_id
            ),
            isActive: true,
            isDeleted: false,
          })
          .sort({ createdAt: -1 })
          .exec(function (err, result) {
            let dataToPass = {
              count: count,
              data: result,
            };
            if (err) {
              res.json(
                Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
              );
            } else {
              res.json(
                Response(
                  constant.SUCCESS_CODE,
                  constant.FETCH_SUCCESS,
                  dataToPass
                )
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

  getVideoCallNotifications().then(function () {});
}

function getAssignedQuestion(req, res) {
  async function getAssignedQuestion() {
    try {
      if (req.body.user_id && req.body.assessment_id) {
        let queryData = await patientAssessmentModel
          .aggregate([
            {
              $match: {
                assessment_id: mongoose.Types.ObjectId(req.body.assessment_id),
                user_id: mongoose.Types.ObjectId(req.body.user_id),
              },
            },
            {
              $lookup: {
                from: "questionlists",
                localField: "question_id",
                foreignField: "_id",
                as: "questionInfo",
              },
            },
          ])
          .exec();

        if (queryData && queryData.length > 0) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, queryData)
          );
        } else {
          res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
        }
      }
    } catch (error) {
      console.log("Error in getAssignedQuestion");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  getAssignedQuestion().then((response) => {});
}

function getAssignedAssessment(req, res) {
  async function getAssignedAssessment() {
    try {
      let rawAssessment = await patients
        .aggregate([
          { $match: { user_id: mongoose.Types.ObjectId(req.body.user_id) } },

          {
            $lookup: {
              from: "assessmentlists",
              let: { assessment_id: "$assessment_id" },
              pipeline: [
                { $match: { $expr: { $and: [{ isDeleted: false }] } } },
                { $match: { $expr: { $in: ["$_id", "$$assessment_id"] } } },
              ],
              as: "assessmentInfo",
            },
          },
          {
            $unwind: {
              path: "$assessmentInfo",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "questionlists",
              let: { assesst: "$assessmentInfo._id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$isDeleted", false] },
                        { $eq: ["$assessment_id", "$$assesst"] },
                      ],
                    },
                  },
                },
              ],
              as: "questionInfo",
            },
          },
          {
            $unwind: {
              path: "$questionInfo",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "patientassessments",
              let: {
                assessmentId: "$assessmentInfo._id",
                userId: "$user_id",
                questionId: "$questionInfo._id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$user_id", "$$userId"] },
                        { $eq: ["$assessment_id", "$$assessmentId"] },
                        { $eq: ["$question_id", "$$questionId"] },
                      ],
                    },
                  },
                },
              ],
              as: "patientAssessmentInfo",
            },
          },
          {
            $project: {
              user_id: 1,
              patientAssessmentInfo: 1,
              assessmentId: "$assessmentInfo._id",
              assessmentName: "$assessmentInfo.name",
              assessmentType: "$assessmentInfo.assessment_type",
              questionId: "$questionInfo._id",
              questionOpt: "$questionInfo.options",
            },
          },
          {
            $group: {
              _id: {
                assessmentId: "$assessmentId",
                assessmentType: "$assessmentType",
              },
              assessmentId: { $first: "$assessmentId" },
              user_id: { $first: "$assessmentId" },
              assessmentName: { $first: "$assessmentName" },
              assessmentType: { $first: "$assessmentType" },
              questionDet: {
                $push: {
                  patientAssessmentInfo: "$patientAssessmentInfo",
                  questionId: "$questionId",
                  questionOpt: "$questionOpt",
                },
              },
            },
          },
        ])
        .exec();

      if (rawAssessment.length > 0) {
        let patientAssessmentArray = [];
        for (let x of rawAssessment) {
          if (x.assessmentName != null) {
            let eachAssesstment = {
              name: x.assessmentName,
              assessment_type: x.assessmentType,
              assessmentId: x.assessmentId,
            };
            let totalCount = 0;
            for (let y of x.questionDet) {
              if (
                y.patientAssessmentInfo &&
                y.patientAssessmentInfo.length > 0
              ) {
                y.questionOpt.map((obj) => {
                  y.patientAssessmentInfo.map((patientObj) => {
                    if (
                      patientObj &&
                      patientObj.textAns &&
                      x.assessmentType == "Screening"
                    ) {
                      totalCount = totalCount + obj.optionPoint;
                      eachAssesstment.status = "completed";
                    } else if (
                      patientObj &&
                      patientObj.textAns &&
                      x.assessmentType == "Normal"
                    ) {
                      eachAssesstment.status = "completed";
                    } else {
                      patientObj.options.filter((inrObj) => {
                        if (
                          JSON.parse(JSON.stringify(obj._id)) ==
                            JSON.parse(JSON.stringify(inrObj._id)) &&
                          x.assessmentType == "Screening"
                        ) {
                          totalCount = totalCount + obj.optionPoint;
                          eachAssesstment.status = "completed";
                        }
                        if (
                          JSON.parse(JSON.stringify(obj._id)) ==
                            JSON.parse(JSON.stringify(inrObj._id)) &&
                          x.assessmentType == "Normal"
                        ) {
                          if (eachAssesstment.status == undefined) {
                            eachAssesstment.status = "completed";
                          }
                        }
                      });
                    }
                  });
                });
              } else {
                if (eachAssesstment.status == undefined) {
                  eachAssesstment.status = "pending";
                }
              }
              eachAssesstment.totalCount = totalCount;
            }
            patientAssessmentArray.push(eachAssesstment);
          }
        }
        res.json(
          Response(
            constant.SUCCESS_CODE,
            constant.UPDATE_SUCCESS,
            patientAssessmentArray
          )
        );
      }
    } catch (error) {
      console.log("Error in getAssignedAssessment");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  getAssignedAssessment().then((response) => {});
}

function getMotivationList(req, res) {
  async function getMotivationList() {
    try {
      if (req.body.hospital_id) {
        let result = await commonQuery.fetch_all_motivation(
          motivations,
          req.body.hospital_id
        );

        res.json(
          Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, result)
        );
      }
    } catch (error) {
      console.log("Error in getMotivationList");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  getMotivationList().then((response) => {});
}

function showHospitalAssessment(req, res) {
  async function showHospitalAssessment() {
    try {
      if (req.body.hospital_id) {
        let data = await commonQuery.fetch_all_paginated_populate(
          patients,
          req.body.hospital_id,
          "",
          "",
          "assessment_id"
        );
        res.json(
          Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, data)
        );
      }
    } catch (error) {
      console.log("Error in showHospitalAssessment");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  showHospitalAssessment().then((response) => {});
}

function saveHospitalAssessment(req, res) {
  async function saveHospitalAssessment() {
    try {
      if (req.body.hospital_id) {
        let { hospital_id, inputData } = req.body;
        let userId = inputData.patientName;
        let assessemntId = inputData.assessmentId;

        let value = await commonQuery.setAssessmentArray(
          patients,
          hospital_id,
          userId,
          assessemntId
        );
        if (value.ok) {
          res.json(Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS));
        }
      }
    } catch (error) {
      console.log("saveHospitalAssessment error");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  saveHospitalAssessment().then((res) => {});
}

function savePatientAssessment(req, res) {
  async function savePatientAssessment() {
    try {
      if (req.body.length > 0) {
        let arrayObj = req.body;
        let totalPointEarned = 0;
        let round = 0;
        let assessmentInfo;

        for (let eachObj of arrayObj) {
          if (round == 0) {
            round++;
            let searchCond = { _id: eachObj.assessment_id };
            assessmentInfo = await commonQuery.findoneData(
              assessmentListModel,
              searchCond
            );
            if (assessmentInfo.assessment_type == "Screening") {
              arrayObj.forEach((x) => {
                if (x.options && x.options.length && !x.textAns) {
                  x.options.forEach((y) => {
                    totalPointEarned = totalPointEarned + y.optionPoint;
                  });
                }
                if (x.textAns) {
                  totalPointEarned = totalPointEarned + x.optionPoint;
                }
              });
            }
          }
          if (eachObj.user_id && eachObj.question_id) {
            let {
              user_id,
              question_id,
              assessment_id,
              options,
              textAns,
            } = eachObj;
            let saveObj;
            let updateCond;
            if (options && options.length > 0) {
              saveObj = {
                options,
              };
              updateCond = {
                user_id,
                question_id,
                assessment_id,
              };
            }
            if (textAns) {
              saveObj = {
                textAns,
                options,
              };
              updateCond = {
                user_id,
                question_id,
                assessment_id,
              };
            }
            if (
              assessmentInfo &&
              assessmentInfo.assessment_type == "Screening"
            ) {
              updateCond.totalPointEarned = totalPointEarned;
            }
            let saveData = await commonQuery.updateAndUpsert(
              patientAssessmentModel,
              updateCond,
              saveObj
            );
          }
        }
        let resData = {
          totalPointEarned,
        };
        res.json(
          Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, resData)
        );
      }
    } catch (error) {
      console.log("Error in savePatientAssessment");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  savePatientAssessment().then((response) => {});
}

function deleteAssessment(req, res) {
  async function deleteAssessment() {
    try {
      let { user_id, data, type } = req.body;
      if (user_id) {
        if (type == "assessment") {
          let obj = {
            user_id: mongoose.Types.ObjectId(user_id),
            _id: mongoose.Types.ObjectId(data),
          };
          let updateData = {
            isDeleted: true,
          };
          let result = await commonQuery.updateOneDocument(
            assessmentListModel,
            obj,
            updateData
          );
          if (result._id) {
            res.json(Response(constant.SUCCESS_CODE, constant.DELETE_SUCCESS));
          } else {
            res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
          }
        } else {
          if (type == "question") {
            let obj = {
              _id: mongoose.Types.ObjectId(data),
            };
            let updateData = {
              isDeleted: true,
            };
            let result = await commonQuery.updateOneDocument(
              questionModel,
              obj,
              updateData
            );
            if (result.isDeleted) {
              res.json(
                Response(constant.SUCCESS_CODE, constant.DELETE_SUCCESS)
              );
            } else {
              res.json(
                Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS)
              );
            }
          }
        }
      }
    } catch (error) {
      console.log("Error in deleteAssessment");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  deleteAssessment().then((response) => {});
}

function getAllAssessmentMobile(req, res) {
  async function getAllAssessmentMobile_Method() {
    try {
      if (req.body.user_id) {
        let user_id = req.body.user_id;
        let data = await commonQuery.getAssessmentId(patients, user_id);
        if (data.length > 0) {
          // let dataRes = data[0].assessment_info;
          let newData = [];

          for (let x of data) {
            let assessmentInfo = x.assessment_info;
            if (x.questionInfo && x.questionInfo.length > 0) {
              assessmentInfo.status = "Completed";
            } else {
              assessmentInfo.status = "Pending";
            }
            if (!assessmentInfo.isDeleted) {
              if (
                req.body.search_txt == "" ||
                req.body.search_txt == null ||
                req.body.search_txt == "undefined"
              ) {
                newData.push(assessmentInfo);
              } else {
                var regex = new RegExp(req.body.search_txt, "i");
                let found = assessmentInfo.name.match(regex);
                if (found != null && found.length > 0) {
                  newData.push(assessmentInfo);
                }
              }
            }
          }
          res.json(
            Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, newData)
          );
        } else {
          res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
        }
      } else {
        res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
      }
    } catch (error) {
      console.log("getAllAssessmentMobile error");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  getAllAssessmentMobile_Method().then(function (params) {});
}

function getAllAssessment(req, res) {
  async function getAllAssessment_Method() {
    const filterValue =
      req.body.filterValue && req.body.filterValue.value
        ? req.body.filterValue.value
        : "";

    try {
      let count =
        req.body.paginate && req.body.paginate.pageSize
          ? parseInt(req.body.paginate.pageSize)
          : 20;
      let skip = 0;
      if (
        req.body.paginate &&
        req.body.paginate.pageSize &&
        req.body.paginate.pageIndex
      ) {
        skip = req.body.paginate.pageSize * req.body.paginate.pageIndex;
      }

      var sortObject = { updatedAt: -1 };
      // if (req.body.sort.active && req.body.sort.direction) {
      //     sortObject[req.body.sort.active] = req.body.sort.direction;
      // } else {
      //     sortObject = {updatedAt:-1 }
      // }
      const sort = sortObject;
      const { cond } = req.body;
      let searchText = decodeURIComponent(filterValue).replace(
        /[[\]{}()*+?,\\^$|#\s]/g,
        "\\s+"
      );
      if (filterValue) {
        cond.$or = [
          { fromDate: new RegExp(searchText, "gi") },
          { name: new RegExp(searchText, "gi") },
          { toDate: new RegExp(searchText, "gi") },
        ];
      }
      let QuestionList = await commonQuery.findDataBySortSkipLimit(
        assessmentListModel,
        cond,
        sort,
        count,
        skip
      );

      if (QuestionList.status) {
        assessmentListModel.count(cond).exec((err, count) => {
          if (count >= 0) {
            let dataObj = {
              data: QuestionList.data,
              totalCount: count,
            };
            res.json(
              Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, dataObj)
            );
          }
        });
      }
    } catch (error) {
      console.log("getAllAssessment error");
      res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
    }
  }
  getAllAssessment_Method().then(function (params) {});
}

function getAssessmentQuestion(req, res) {
  async function getAssessmentQuestionMethod() {
    try {
      if (req.body.assessment_id) {
        let { assessment_id, user_id } = req.body;
        let condObj = {
          assessment_id,
          isDeleted: false,
        };
        let questionList = await commonQuery.findPatientQuestion(
          questionModel,
          assessment_id,
          user_id
        );
        if (questionList.length > 0) {
          questionList.forEach((eachObj) => {
            if (eachObj.data && eachObj.data.length > 0) {
              let originalquestionList = eachObj.options;
              let savequestionList = eachObj.data[0].options;
              originalquestionList.map((x) => {
                if (eachObj.assessmentType == "text") {
                  eachObj.textAns = eachObj.data[0].textAns;
                  if (eachObj.typeOfAssessment == "Screening") {
                    eachObj.totalPointEarned = eachObj.data[0].totalPointEarned;
                  }
                }
                if (eachObj.assessmentType != "text") {
                  if (eachObj.typeOfAssessment == "Screening") {
                    eachObj.totalPointEarned = eachObj.data[0].totalPointEarned;
                  }
                  savequestionList.forEach((y) => {
                    if (JSON.stringify(y._id) == JSON.stringify(x._id)) {
                      x.status = true;
                      eachObj.saved = true;
                    }
                  });
                }
              });
              delete eachObj.data;
            }
          });
        }
        if (questionList.length >= 0) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              questionList
            )
          );
        }
      } else {
        res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
      }
    } catch (error) {
      console.log("getAssessmentQuestion error");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  getAssessmentQuestionMethod().then(function (params) {});
}

function getUserQuestionInfo(req, res) {
  async function getUserQuestionInfoMethod() {
    const action = req.body.action;
    const assessment_id = req.body.assessment_id;
    const user_id = req.body.user_id;
    const filterValue =
      req.body.filterValue && req.body.filterValue.value
        ? req.body.filterValue.value
        : "";
    try {
      let count = req.body.pageSize ? parseInt(req.body.pageSize) : 20;
      let skip = 0;
      if (req.body.pageSize && req.body.pageIndex) {
        skip = req.body.pageSize * req.body.pageIndex;
      }
      const sort = { createdAt: -1 };
      let cond = {};
      let searchText = decodeURIComponent(filterValue).replace(
        /[[\]{}()*+?,\\^$|#\s]/g,
        "\\s+"
      );

      if (filterValue) {
        cond.$or = [
          { surveyType: new RegExp(searchText, "gi") },
          { question: new RegExp(searchText, "gi") },
        ];
      }
      if (action == "question") {
        cond.assessment_id = mongoose.Types.ObjectId(assessment_id);
        cond.user_id = mongoose.Types.ObjectId(user_id);
        cond.isDeleted = false;
        let questionList = await commonQuery.findDataBySortSkipLimit(
          questionModel,
          cond,
          sort,
          count,
          skip
        );
        if (questionList.status) {
          questionModel.count(cond).exec((err, count) => {
            if (!err) {
              let dataObj = {
                data: questionList.data,
                totalCount: count,
              };
              res.json(
                Response(
                  constant.SUCCESS_CODE,
                  constant.UPDATE_SUCCESS,
                  dataObj
                )
              );
            }
          });
        }
      } else {
        res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
      }
    } catch (error) {
      console.log("getUserQuestionInfo error");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  getUserQuestionInfoMethod().then(function (params) {});
}

function saveQuestionList(req, res) {
  async function saveQuestionList_method() {
    try {
      const { user_id, name, assessment_type } = req.body;

      const saveObj = {
        user_id: user_id,
        fromData: moment().utc().format(),
        toDate: moment().utc().format(),
        name: name,
        assessment_type: assessment_type,
      };

      const saveQuestionListData = await commonQuery.InsertIntoCollection(
        assessmentListModel,
        saveObj
      );

      if (saveQuestionListData.id) {
        res.json(Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS));
      } else {
        res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
      }
    } catch (error) {
      console.log("error in saveQuestionList");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  saveQuestionList_method().then(function (data) {});
}

function addAssessmentQues(req, res) {
  async function addAssessmentQues() {
    try {
      let {
        user_id,
        question,
        assessment_id,
        assessmentType,
        options,
        perform,
        userId,
        question_id,
        optionValue,
        typeOfAssessment,
        textPoint,
      } = req.body.AllQuestionForm.questions[0];
      if (assessmentType == "text") {
        options = [{ optionValue: "text" }];
      }
      if (assessmentType == "text" && typeOfAssessment == "Screening") {
        options = [{ optionValue: "text", optionPoint: textPoint }];
      }

      if (user_id || userId) {
        if (perform == "update") {
          let updateCond = {
            question: question,
            options: optionValue,
          };
          let findCond = {
            _id: mongoose.Types.ObjectId(question_id),
          };
          let updateQuestion = await commonQuery.updateOneDocument(
            questionModel,
            findCond,
            updateCond
          );
          if (updateQuestion.assessmentType) {
            res.json(Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS));
          } else {
            res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
          }
        } else {
          let saveObj = {
            user_id,
            assessment_id,
            assessmentType,
            question,
            options,
            typeOfAssessment,
          };
          let addSurveyData = await commonQuery.InsertManyIntoCollection(
            questionModel,
            saveObj
          );

          if (addSurveyData.length > 0) {
            res.json(Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS));
          } else {
            res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
          }
        }
      } else {
        res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS));
      }
    } catch (error) {
      console.log("error in addAssessmentQues");
      res.json(Response(constant.ERROR_CODE, constant.INTERNAL_ERROR));
    }
  }
  addAssessmentQues().then((response) => {});
}

function activitylist(req, res) {
  async function activitylist() {
    try {
      if (req.body.user_id) {
        let searchCond = {
          course_id: req.body.course_id,
          user_id: req.body.user_id,
        };
        let updateData = {
          course_status: req.body.course_status,
        };
        let update = await commonQuery.updateOne(
          usercourses,
          searchCond,
          updateData
        );

        let moduleId = await commonQuery.findoneData(usercourses, searchCond);
        let start = new Date();
        start.setHours(0, 0, 0, 0);
        let searchPoint = {
          user_id: req.body.user_id,
          module_id: moduleId.module_id,
          createdAt: { $gt: start },
        };
        let updatePoint = await lmspoints
          .updateOne(searchPoint, { $inc: { point_earned: 100 } })
          .exec();

        if (updatePoint.ok == 1) {
          res.json(Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS));
        }
      } else {
        res.json(
          res.json(Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS))
        );
      }
    } catch (error) {
      res.json(Response(constant.ERROR_CODE, error, null));
    }
  }
  activitylist().then((response) => {});
}

function playList(req, res) {
  async function playList() {
    try {
      if (req.body.user_id) {
        let lmsUser = await usercourses
          .find({ user_id: mongoose.Types.ObjectId(req.body.user_id) })
          .sort({ createdAt: -1 })
          .exec();

        if (lmsUser && lmsUser.length > 0) {
          let start = new Date();
          start.setHours(0, 0, 0, 0);
          let matchCond = {
            user_id: req.body.user_id,
            createdAt: { $gt: start },
          };
          let data = await commonQuery.findAll(usercourses, matchCond);
          if (data.length > 0) {
            let matchCond = {
              lmsprogram_id: { $exists: true, $type: 2 },
              lmsinstance_id: { $exists: true, $type: 2 },
              connected_user_id: {
                $in: [mongoose.Types.ObjectId(req.body.user_id)],
              },
            };
            let isTrue = await commonQuery.findoneData(programs, matchCond);
            if (isTrue) {
              res.send(data);
            } else {
              res.send([]);
            }
          } else {
            let playlist = await programs
              .aggregate([
                {
                  $match: {
                    lmsprogram_id: { $exists: true, $type: 2 },
                    lmsinstance_id: { $exists: true, $type: 2 },
                    connected_user_id: {
                      $in: [mongoose.Types.ObjectId(req.body.user_id)],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "usercourses",
                    let: { lmsprogram_id: "$lmsprogram_id" },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              {
                                $eq: [
                                  "$user_id",
                                  mongoose.Types.ObjectId(req.body.user_id),
                                ],
                              },
                              { $lt: ["$createdAt", start] },
                              { $eq: ["$program_id", "$$lmsprogram_id"] },
                            ],
                          },
                        },
                      },
                    ],
                    as: "userCourcesInfo",
                  },
                },
                {
                  $unwind: "$userCourcesInfo",
                },

                {
                  $sort: {
                    "userCourcesInfo.createdAt": -1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $project: {
                    nextSequence: {
                      $sum: ["$userCourcesInfo.module_sequence", 1],
                    },
                    learningModule: "$userCourcesInfo.program_id",
                  },
                },
                {
                  $lookup: {
                    from: "courses",
                    let: {
                      program_id: "$learningModule",
                      nextSequence: "$nextSequence",
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              { $eq: ["$program_id", "$$program_id"] },
                              { $eq: ["$module_sequence", "$$nextSequence"] },
                            ],
                          },
                        },
                      },
                    ],
                    as: "courcesInfo",
                  },
                },
              ])
              .exec();

            let playlistArray = playlist[0].courcesInfo;
            if (playlistArray && playlistArray.length > 0) {
              insertPlaylist(req, playlistArray);
              inserLMSPoint(req, playlistArray);
            }
            res.send(playlistArray);
          }
        } else {
          let playlistData = await programs
            .aggregate([
              {
                $match: {
                  lmsprogram_id: { $exists: true, $type: 2 },
                  lmsinstance_id: { $exists: true, $type: 2 },
                  connected_user_id: {
                    $in: [mongoose.Types.ObjectId(req.body.user_id)],
                  },
                },
              },
              {
                $lookup: {
                  from: "courses",
                  let: { lmsprogram_id: "$lmsprogram_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$program_id", "$$lmsprogram_id"] },
                      },
                    },
                  ],
                  as: "courseInfo",
                },
              },
              {
                $unwind: "$courseInfo",
              },
              {
                $match: { "courseInfo.module_sequence": 1 },
              },
              {
                $group: {
                  _id: "$lmsprogram_id",
                  courseInfo: { $push: "$courseInfo" },
                },
              },
            ])
            .exec();
          let playlistArray = playlistData[0] && playlistData[0].courseInfo;
          if (playlistArray && playlistArray.length > 0) {
            insertPlaylist(req, playlistArray);
            inserLMSPoint(req, playlistArray);
          }
          if (playlistArray) {
            res.send(playlistArray);
          }
          if (playlistArray == undefined) {
            playlistArray = [];
            res.send(playlistArray);
          }
        }
      } else {
        res.json(
          Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
        );
      }
    } catch (error) {
      console.log("error in playlist");
    }
  }
  playList().then((res) => {});
}

async function inserLMSPoint(req, activityArray) {
  let playlistArray = [];
  let firstActivity = activityArray[0];

  let obj = {
    user_id: req.body.user_id,
    program_id: firstActivity.program_id,
    module_id: firstActivity.module_id,
    module_sequence: firstActivity.module_sequence,
    point_earned: 0,
    total_point: activityArray.length * 100,
  };
  commonQuery.InsertManyIntoCollection(lmspoints, obj);
}

function insertPlaylist(req, array) {
  let playlistArray = [];
  for (var eachArry of array) {
    let obj = {
      user_id: req.body.user_id,
      program_id: eachArry.program_id,
      module_id: eachArry.module_id,
      module_sequence: eachArry.module_sequence,
      module_start: moment().format("YYYY-MM-DDT00:00:00.000") + "Z",
      course_id: eachArry.course_id,
      course_title: eachArry.course_title,
      course_status: false,
    };
    playlistArray.push(obj);
  }
  commonQuery.InsertManyIntoCollection(usercourses, playlistArray);
}

cron.schedule("* * 23 * * *", async function () {
  await fetchLMScourse();
});
async function fetchLMScourse() {
  let authorizationToken = await commonQuery.findoneData(adobeModel);
  let cond = {
    lmsprogram_id: { $exists: true, $type: 2 },
    lmsinstance_id: { $exists: true, $type: 2 },
  };
  let adobeProgram = await commonQuery.findAll(programs, cond);
  if (authorizationToken.access_token && adobeProgram.length > 0) {
    for (let x of adobeProgram) {
      let module_sequence = 0;
      let programlearningId = x.lmsprogram_id.split(":")[1];
      // let programUri = urlLmsV2 + "/learningObjects/" + qs.stringify({"learningProgram":programlearningId})
      let programUri = urlLmsV2 + "/learningObjects/" + x.lmsprogram_id;

      request(
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: authorizationToken.access_token,
          },
          uri: programUri,
          method: "GET",
        },
        function (error, response, body) {
          if (body) {

            let learningObj = JSON.parse(body);
            if (
              learningObj.data &&
              learningObj.data.relationships &&
              learningObj.data.relationships.subLOs
            ) {
              for (let [
                i,
                eachArry,
              ] of learningObj.data.relationships.subLOs.data.entries()) {
                // let module_sequence = i + 1;
                // module_sequence++;
                let courseId = eachArry.id.split("course:")[1];

                request(
                  `https://captivateprime.adobe.com/primeapi/v1/courses/${courseId}/modules`,
                  {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                      Authorization: authorizationToken.access_token,
                    },
                    method: "GET",
                  },
                  function (error, response, body) {
                    if (body) {
                      let courseInfo = JSON.parse(body).data;
                      module_sequence++;
                      if (courseInfo.length > 0) {
                        for (let eachCourse of courseInfo) {
                          let eachCourseObj = eachCourse.attributes;
                          let courseObj = {
                            moduleType: eachCourseObj.moduleType,
                            program_id: x.lmsprogram_id,
                            course_id: eachCourse.id,
                            course_title: eachCourseObj.title,
                            course_description: eachCourseObj.description || null,
                            module_id: courseId,
                            module_type: eachArry.type,
                            module_sequence: module_sequence,
                          };
                          let findCond = { course_id: eachCourse.id };
                          commonQuery.updateAndUpsert(
                            courseModel,
                            findCond,
                            courseObj
                          );
                        }
                      }

                    }

                  }
                );
              }
            }

          }

        }
      );
    }
  }
}

function getRefreshToken() {
  async function adobeToken() {
    let form = {
      client_id: constant.client_id,
      client_secret: constant.client_secret,
      code: "7d2a1a998aa6b224ec619614c97a8fc6",
    };
    let uri = "https://captivateprime.adobe.com/oauth/token";
    request(
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        uri: uri,
        form: form,
        method: "POST",
      },
      function (error, response, body) {
        if (response.statusCode == 200) {
          let data = JSON.parse(body);
          adobeModel.find({}).deleteMany().exec();
          let dataObj = {
            refresh_token: data.refresh_token,
            access_token: `oauth ${data.access_token}`,
            created: new Date(),
            user_role: data.user_role,
            account_id: data.account_id,
            user_id: data.user_id,
            expiresIn: data.expires_in,
          };
          commonQuery.InsertIntoCollection(adobeModel, dataObj);
          // res.json(Response(constant.SUCCESS_CODE, dataObj.access_token));
        }
        if (error) {
          console.log("Error in getRefreshToken");
        }
      }
    );
  }
  adobeToken().then((res) => {});
}

cron.schedule("* * * * Thursday", async function () {
  getAccessToken();
});

// getAccessToken()

async function getAccessToken() {
  let adobeInfo = await commonQuery.findoneData(adobeModel);
  let form = {
    client_id: "7bc9a9b7-a374-4074-9237-4126bd84de9f",
    client_secret: "cee61430-07d1-4b98-9094-1f200a218fe7",
    refresh_token: adobeInfo.refresh_token,
  };
  let refreshUri = "https://captivateprime.adobe.com/oauth/token/refresh";
  request(
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      uri: refreshUri,
      form: form,
      method: "POST",
    },
    function (error, response, body) {
      // console.log()
      if (response.statusCode == 200) {
        let access_token = JSON.parse(body).access_token;
        if (access_token) {
          request(
            `https://captivateprime.adobe.com/oauth/token/check?access_token=${access_token}`,
            function (error, resonse, body) {
              if (response.statusCode == 200) {
                let data = JSON.parse(body);
                let dataObj = {
                  refresh_token: adobeInfo.refresh_token,
                  access_token: `oauth ${data.access_token}`,
                  created: new Date(),
                  user_role: data.user_role,
                  account_id: data.account_id,
                  user_id: data.user_id,
                };
                let updateCond = { refresh_token: adobeInfo.refresh_token };
                commonQuery.updateOne(adobeModel, updateCond, dataObj);
                // commonQuery.InsertIntoCollection(adobeModel,dataObj);
              }
            }
          );
        }
      }
    }
  );
}

function gettingModule() {
  let apiUri =
    "https://captivateprime.adobe.com/primeapi/v1/courses/1592283/modules";
  request(
    "https://captivateprime.adobe.com/primeapi/v1/courses/1592283/modules",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "oauth 9341169f2bf68c8678377cb384e964cc",
      },
      method: "GET",
    },
    function (error, response, body) {}
  );
}

function deleteCareTaker(req, res) {
  async function deleteCareTaker() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body.user_id),
        };

        let updateData = { islive: false };

        let deleteCareMember = await commonQuery.updateOne(
          users,
          condition,
          updateData
        );
        if (deleteCareMember) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.DELETE_SUCCESS,
              deleteCareMember
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
  deleteCareTaker().then(function () {});
}

function deleteCareTaker(req, res) {
  async function deleteCareTaker() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body.user_id),
        };

        let updateData = { islive: false };

        let deleteCareMember = await commonQuery.updateOne(
          users,
          condition,
          updateData
        );
        if (deleteCareMember) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.DELETE_SUCCESS,
              deleteCareMember
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
  deleteCareTaker().then(function () {});
}

function editCareTakerDetail(req, res) {
  async function editCareTakerDetail() {
    try {
      if (req.body && req.body.user_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.user_id) };

        let updateData = {
          firstName: req.body.firstName,
          middleName: req.body.middleName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          phoneCountry: req.body.phoneCountry,
        };

        let updateCareTakerUserDetail = await commonQuery.updateOne(
          users,
          condition,
          updateData
        );

        if (updateCareTakerUserDetail) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              updateCareTakerUserDetail
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
  editCareTakerDetail().then(function () {});
}

function readNotification(req, res) {
  async function readNotification() {
    try {
      if (req.body && req.body.notification_id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body.notification_id),
        };

        let updateData = { isRead: true };

        let updateNotification = await commonQuery.updateOne(
          notifications,
          condition,
          updateData
        );
        if (updateNotification) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              updateNotification
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
  readNotification().then(function () {});
}

function patientPendingRequest(req, res) {
  async function patientPendingRequest() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          isAccepted: false,
          user_id: mongoose.Types.ObjectId(req.body.user_id),
        };

        let patientReqList = await commonQuery.getPatientPendingAppointmentRequests(
          appointmentrequests,
          condition
        );

        if (patientReqList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              patientReqList
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
  patientPendingRequest().then(function () {});
}

function patientAcceptedRequest(req, res) {
  async function patientAcceptedRequest() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          isActive: true,
          isCompleted: false,
          patient_user_id: mongoose.Types.ObjectId(req.body.user_id),
        };

        let patientReqList = await commonQuery.fetch_all(bookings, condition);

        if (patientReqList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              patientReqList
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
  patientAcceptedRequest().then(function () {});
}

function getMedicationReminders(req, res) {
  async function getMedicationReminders() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          user_id: mongoose.Types.ObjectId(req.body.user_id),
          $or: [
            { startdate: { $lte: req.body.date } },
            { endate: { $gte: req.body.date } },
          ],
        };

        let dataToPass = [];

        let morningDosages = [];
        let afternoonnDosages = [];
        let eveningDosages = [];

        let dosageList = await commonQuery.getDateWiseReminders(
          dosages,
          condition
        );
        if (dosageList) {
          for (var i = 0; i < dosageList.length; i++) {
            if (dosageList[i].isMorning === true) {
              morningDosages.push(dosageList[i]);
            }
            if (dosageList[i].isAfternoon === true) {
              afternoonnDosages.push(dosageList[i]);
            }
            if (dosageList[i].isEvening === true) {
              eveningDosages.push(dosageList[i]);
            }
          }
          dataToPass = [
            {
              morning: morningDosages,
              afternoon: afternoonnDosages,
              evening: eveningDosages,
            },
          ];
          res.json(
            Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, dataToPass)
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }

        // {user_id:ObjectId("5eb030e733486747ba2973c6"),$or:[{startdate:{$lte:new Date()}},{endate:{$gte:new Date()}}]}
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  getMedicationReminders().then(function () {});
}

function getPatientDetails(req, res) {
  async function getPatientDetails() {
    try {
      if (req.body && req.body.user_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.user_id) };
        let patientDetails = await commonQuery.aggregateFunc(
          users,
          "patients",
          "_id",
          "user_id",
          condition
        );

        if (patientDetails) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              patientDetails
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
  getPatientDetails().then(function () {});
}

function getMedicine(req, res) {
  async function getMedicine() {
    try {
      if (req.body && req.body.type === "medi") {
        let medicineList = await commonQuery.findAll(medicines);

        if (medicineList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              medicineList
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
  getMedicine().then(function () {});
}

function getCompletedPatientAppointments(req, res) {
  async function getCompletedPatientAppointments() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          patient_user_id: mongoose.Types.ObjectId(req.body.user_id),
          isCompleted: true,
        };
        let bookingsList = await commonQuery.findAll(bookings, condition);

        if (bookingsList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              bookingsList
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
  getCompletedPatientAppointments().then(function () {});
}

function getPatientAppointments(req, res) {
  async function getPatientAppointments() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          patient_user_id: mongoose.Types.ObjectId(req.body.user_id),
          isCancelled: false,
          isCompleted: false,
          isActive: true,
        };
        let bookingsList = await commonQuery.findAll(bookings, condition);

        if (bookingsList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              bookingsList
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
  getPatientAppointments().then(function () {});
}

function getCareTakerAppointments(req, res) {
  // console.log("REQ>B{", req.body);
  async function getCareTakerAppointments() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          caretaker_user_id: mongoose.Types.ObjectId(req.body.user_id),
          isActive: true,
          isCancelled: false,
          isCompleted: false,
          appointment_date: {
            $gte: new Date(req.body.startDate),
            $lte: new Date(req.body.endDate),
          },
        };

        // console.log("CONDITION", condition);

        let appointmentList = await commonQuery.fetch_all(bookings, condition);
        // console.log("APPOINTMENTLIST", appointmentList);

        if (appointmentList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              appointmentList
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
  getCareTakerAppointments().then(function () {});
}

function getIndividualCareTakerAppointments(req, res) {
  async function getIndividualCareTakerAppointments() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          caretaker_user_id: mongoose.Types.ObjectId(req.body.user_id),
          isActive: true,
          isCancelled: false,
          isCompleted: false,
        };

        let appointmentList = await commonQuery.findAll(bookings, condition);

        if (appointmentList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              appointmentList
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
  getIndividualCareTakerAppointments().then(function () {});
}

function getCareTakerCompletedAppointments(req, res) {
  async function getCareTakerCompletedAppointments() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          hospital_user_id: mongoose.Types.ObjectId(req.boody.user_id),

          isCompleted: true,
        };

        let appointmentList = await commonQuery(bookings, condition);

        if (appointmentList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              appointmentList
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
  getCareTakerCompletedAppointments().then(function () {});
}

function bookAppointment(req, res) {
  console.log("REQ", req.body);
  async function bookAppointment() {
    try {
      let patientname;
      let caretakername;
      let PatientData;
      let hospitalID;
      if (req.body && req.body.patient_user_id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body.patient_user_id),
        };

        let getPatientDetail = await commonQuery.findoneData(users, condition);

        console.log("get1", getPatientDetail);

        if (getPatientDetail) {
          PatientData = getPatientDetail;
          patientname = getPatientDetail.firstName;

          let caretakerCondition = {
            _id: mongoose.Types.ObjectId(req.body.caretaker_id),
          };
          let careTakerrUserId = await commonQuery.findoneData(
            caretakers,
            caretakerCondition
          );
          console.log("caretaker2", careTakerrUserId);

          if (careTakerrUserId) {
            let caretakerDataCondition = {
              _id: mongoose.Types.ObjectId(careTakerrUserId.user_id),
            };
            let careTakerDetailsData = await commonQuery.findoneData(
              users,
              caretakerDataCondition
            );
            console.log("caretaker3", careTakerDetailsData);
            if (careTakerDetailsData) {
              caretakername = careTakerDetailsData.firstName;
              let hospitalIDConditon = {
                caretaker_id: mongoose.Types.ObjectId(req.body.caretaker_id),
              };
              let hospitalDetailData = await commonQuery.findoneData(
                caretakerhospitals,
                hospitalIDConditon
              );
              console.log("caretaker4", hospitalDetailData);
              if (hospitalDetailData) {
                hospitalID = hospitalDetailData.hospital_id;

                console.log("5", hospitalID);
                let saveApp = {
                  appointment_date: req.body.appointment_date,
                  appointment_time: req.body.appointment_time,
                  caretaker_id: mongoose.Types.ObjectId(req.body.caretaker_id),
                  hospital_id: hospitalID,
                  caretaker_user_id: careTakerDetailsData._id,
                  hospital_user_id: hospitalID,
                  patient_user_id: mongoose.Types.ObjectId(
                    req.body.patient_user_id
                  ),
                  patient_name: patientname,
                  caretaker_name: caretakername,
                  appointment_end_time: req.body.appointment_end_time,
                  appointment_request_id: mongoose.Types.ObjectId(
                    req.body.appointment_request_id
                  ),
                };

                console.log("SavApp", saveApp);

                let saveAppointment = new bookings({
                  appointment_date: req.body.appointment_date,
                  appointment_time: req.body.appointment_time,
                  caretaker_id: mongoose.Types.ObjectId(req.body.caretaker_id),
                  hospital_id: hospitalID,
                  caretaker_user_id: careTakerDetailsData._id,
                  hospital_user_id: hospitalID,
                  patient_user_id: mongoose.Types.ObjectId(
                    req.body.patient_user_id
                  ),
                  patient_name: patientname,
                  caretaker_name: caretakername,
                  appointment_end_time: req.body.appointment_end_time,
                  appointment_request_id: mongoose.Types.ObjectId(
                    req.body.appointment_request_id
                  ),
                });

                let savebookingData = await commonQuery.InsertIntoCollection(
                  bookings,
                  saveAppointment
                );

                console.log("6", saveAppointment);

                if (savebookingData) {
                  let requestCondition = {
                    _id: mongoose.Types.ObjectId(
                      req.body.appointment_request_id
                    ),
                  };

                  let updateRequestCondition = { isAccepted: true };

                  let updateRequestList = await commonQuery.updateOne(
                    appointmentrequests,
                    requestCondition,
                    updateRequestCondition
                  );
                  if (updateRequestList) {
                  }

                  var message = {
                    to: PatientData.deviceToken ? PatientData.deviceToken : "",
                    collapse_key: "your_collapse_key",
                    notification: {
                      title: "Booking Confirmation",
                      body:
                        savebookingData.patient_name +
                        "your appointment has been confirmed on" +
                        moment(savebookingData.appointment_date).format(
                          "MM/DD/YYYY"
                        ) +
                        ". with " +
                        savebookingData.caretaker_name +
                        " at " +
                        moment(savebookingData.appointment_time).format(
                          "HH:mm A"
                        ),
                    },
                    data: {
                      my_key: "CURIO",
                      my_another_key: "NADIM",
                    },
                  };
                  fcm.send(message, async function (err, response) {
                    if (err) {
                      // console.log("Something has gone wrong!", err);
                    } else {
                      // console.log("Successfully sent with response: ", response);
                    }
                  });

                  res.json(
                    Response(
                      constant.SUCCESS_CODE,
                      constant.ADDED_SUCCESS,
                      savebookingData
                    )
                  );
                } else {
                  res.json(
                    Response(
                      constant.ERROR_CODE,
                      constant.FAILED_TO_PROCESS,
                      null
                    )
                  );
                }
              }
            }
          }
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, "hello")
      );
    }
  }
  bookAppointment().then(function () {});
}

function getCareTakerAvailibility(req, res) {
  async function getCareTakerAvailibility() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          user_id: mongoose.Types.ObjectId(req.body.user_id),
          // $and: [
          //   {
          //     toDateTime: {
          //       $lte: req.body.endDate,
          //     },
          //   },
          //   {
          //     fromDateTime: {
          //       $gte: req.body.startDate,
          //     },
          //   },
          // ],
        };

        availability
          .aggregate([
            { $match: condition },

            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "userData",
              },
            },
            { $unwind: "$userData" },
            {
              $project: {
                _id: 1,
                duration: 1,
                fromDateTime: 1,
                toDateTime: 1,
                user_id: 1,
                available_days: 1,
                firstName: "$userData.firstName",
                lastName: "$userData.lastName",
              },
            },
          ])
          .exec(function (err, result) {
            if (err) {
              res.json(
                Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, err)
              );
            } else {
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
  getCareTakerAvailibility().then(function () {});
}

function getCareTakerAvailibilities(req, res) {
  console.log("GGGGSSSSSS", req.body);
  async function getCareTakerAvailibilities() {
    try {
      if (req.body && req.body.user_id) {
        let condition = {
          user_id: mongoose.Types.ObjectId(req.body.user_id),
          $and: [
            {
              toDateTime: {
                $lte: new Date(req.body.endDate),
              },
            },
            {
              fromDateTime: {
                $gte: new Date(req.body.startDate),
              },
            },
          ],
        };

        availability
          .aggregate([
            { $match: condition },

            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "userData",
              },
            },
            { $unwind: "$userData" },
            {
              $project: {
                _id: 1,
                duration: 1,
                fromDateTime: 1,
                toDateTime: 1,
                user_id: 1,
                available_days: 1,
                firstName: "$userData.firstName",
                lastName: "$userData.lastName",
              },
            },
          ])
          .exec(function (err, result) {
            if (err) {
              res.json(
                Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, err)
              );
            } else {
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
  getCareTakerAvailibilities().then(function () {});
}

function addAvailability(req, res) {
  async function addAvailability() {
    if (
      req.body &&
      req.body.startDate &&
      req.body.endDate &&
      req.body.user_id &&
      req.body.week &&
      Array.isArray(req.body.week) &&
      req.body.duration
    ) {
      let temparr = [];
      req.body.week.forEach((element) => {
        if (element.isChecked) {
          temparr.push(element);
        }
      });

      let saveAvailibility = new availability({
        fromDateTime: req.body.startDate,
        toDateTime: req.body.endDate,
        user_id: req.body.user_id,
        availTimeZone: req.body.timeZone ? req.body.timeZone : "",
        available_days: temparr,
        duration: req.body.duration,
      });

      let saveAvailibilityData = await commonQuery.InsertIntoCollection(
        availability,
        saveAvailibility
      );

      if (saveAvailibilityData) {
        res.json(
          Response(
            constant.SUCCESS_CODE,
            constant.ADDED_SUCCESS,
            saveAvailibilityData
          )
        );
      } else {
        res.json(
          Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
        );
      }
    }
  }
  addAvailability().then(function () {});
}

function setAvailability(req, res) {
  console.log("REQ>B", req.body);
  async function setAvailability() {
    if (
      req.body &&
      req.body.startDate &&
      req.body.endDate &&
      req.body.user_id &&
      req.body.week &&
      Array.isArray(req.body.week) &&
      req.body.duration
    ) {
      try {
        let condition = {
          user_id: req.body.user_id,
          $and: [
            {
              toDateTime: {
                $gte: req.body.startDate,
                $gte: req.body.endDate,
              },
            },
            {
              fromDateTime: {
                $lte: req.body.startDate,
                $lte: req.body.endDate,
              },
            },
          ],
        };

        let isInbetween = await commonQuery.findData(availability, condition);

        if (isInbetween) {
          let temparr = [];
          req.body.week.forEach((element) => {
            if (element.isChecked) {
              temparr.push(element);
            }
          });
          let opObject = {
            //specialOfferDescription: req.body.offerdescp ? req.body.offerdescp : '',
            //specialOfferDate: req.body.specialOfferDate ? req.body.specialOfferDate : '',
            fromDateTime: req.body.startDate,
            toDateTime: req.body.endDate,
            user_id: req.body.user_id,
            //specialist_id: req.body.specialist_id,
            availTimeZone: req.body.timeZone ? req.body.timeZone : "",
            available_days: temparr,
            duration: req.body.duration,
          };

          if (req.body.availability_id) {
            let tempondition = {
              _id: req.body.availability_id,
            };

            if (isInbetween.data.length > 0) {
              let temparr = isInbetween.data;
              let filterArr = temparr.filter((item) => {
                if (req.body.availability_id == item._id) {
                  return item;
                }
              });

              if (filterArr.length == 1) {
                let updatedRecord = await commonQuery.updateOneDocument(
                  availability,
                  tempondition,
                  opObject
                );
                if (updatedRecord) {
                  return res.json(
                    Response(
                      constant.SUCCESS_CODE,
                      constant.UPDATE_SUCCESS,
                      updatedRecord.data
                    )
                  );
                } else {
                  return res.json(
                    Response(
                      constant.statusCode.internalservererror,
                      constant.validateMsg.internalError,
                      updatedRecord.error
                    )
                  );
                }
              } else {
                return res.json(
                  Response(
                    constant.statusCode.internalservererror,
                    constant.validateMsg.internalError,
                    constant.validateMsg.internalError
                  )
                );
              }
            } else {
              //found user in multiple loction in single time
              // return res.json(Response(constant.statusCode.alreadyExist, constant.messages.alreadyAvailability, {}));
              if (req.body.availability_id) {
                let updatedRecord = await commonQuery.updateOneDocument(
                  availability,
                  tempondition,
                  opObject
                );
                if (updatedRecord) {
                  return res.json(
                    Response(
                      constant.SUCCESS_CODE,
                      constant.UPDATE_SUCCESS,
                      updatedRecord.data
                    )
                  );
                } else {
                  return res.json(
                    Response(
                      constant.statusCode.internalservererror,
                      constant.validateMsg.internalError,
                      updatedRecord.error
                    )
                  );
                }
              } else {
                let saveObj = await commonQuery.uniqueInsertIntoCollection(
                  availability,
                  opObject
                );
                if (saveObj) {
                  return res.json(
                    Response(
                      constant.SUCCESS_CODE,
                      constant.FETCH_SUCCESS,
                      saveObj.data
                    )
                  );
                } else {
                  return res.json(
                    Response(
                      constant.statusCode.internalservererror,
                      constant.validateMsg.internalError,
                      saveObj.error
                    )
                  );
                }
              }
            }
          } else {
            if (isInbetween.data.length > 0) {
              //found user in multiple loction in single time
              return res.json(Response("Already Exist", {}));
            } else {
              let saveObj = await commonQuery.InsertIntoCollection(
                availability,
                opObject
              );
              if (saveObj) {
                return res.json(
                  Response(200, "Availability Set Succussfully", saveObj.data)
                );
              } else {
                return res.json(
                  Response(
                    constant.ERROR_CODE.FAILED_TO_PROCESS,
                    constant.validateMsg.internalError,
                    saveObj.error
                  )
                );
              }
            }
          }
        } else {
          return res.json(
            Response(
              constant.statusCode.internalservererror,
              constant.validateMsg.internalError,
              isInbetween.err
            )
          );
        }
      } catch (err) {
        console.log("------error------", err);
        return res.json(
          Response(
            constant.statusCode.internalservererror,
            constant.validateMsg.internalError,
            err
          )
        );
      }
    } else {
      return res.json(
        Response(
          constant.statusCode.unauth,
          constant.validateMsg.requiredFieldsMissing,
          constant.validateMsg.requiredFieldsMissing
        )
      );
    }
  }
  setAvailability().then(function (data) {});
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

function getAvailability(req, res) {
  async function getAvailability() {
    try {
      let condition = {};
      if (req.body) {
        if (req.body.user_id) {
          condition.user_id = mongoose.Types.ObjectId(req.body.user_id);
        } else if (req.body.user_id == "") {
          let findUserRoleId = await commonQuery.findoneData(Role, {
            name: constant.varibleType.ADMIN,
          });
          let userRoleId = "";
          if (findUserRoleId.status && findUserRoleId.data) {
            userRoleId = findUserRoleId.data._id;
          }

          let condition1 = {};
          condition1.role_id = userRoleId;
          let AdminId = await commonQuery.findoneData(User, condition1);
          let user_idd = AdminId.data._id;
          condition.user_id = mongoose.Types.ObjectId(user_idd);
        }

        let availabilityData = await commonQuery.findoneData(
          availability,
          condition
        );
        if (availabilityData) {
          if (availabilityData) {
            return res.json(
              Response(
                constant.SUCCESS_CODE,
                constant.FETCH_SUCCESS,
                availabilityData
              )
            );
          } else {
            return res.json(
              Response(
                "Not Found",
                constant.validateMsg.noRecordFound,
                availabilityData.data
              )
            );
          }
        } else {
          return res.json(
            Response(
              constant.statusCode.internalservererror,
              constant.validateMsg.internalError,
              availabilityData.error
            )
          );
        }
      } else {
        return res.json(
          Response(
            constant.statusCode.unauth,
            constant.validateMsg.requiredFieldsMissing,
            constant.validateMsg.requiredFieldsMissing
          )
        );
      }
    } catch (err) {
      console.log("err------------------", err);
      return res.json(
        Response(
          constant.statusCode.internalservererror,
          constant.validateMsg.internalError,
          err
        )
      );
    }
  }
  getAvailability().then(function (data) {});
}

function sendAutoReminder(req, res) {
  async function sendAutoReminder() {
    try {
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  sendAutoReminder().then(function () {});
}

cron.schedule("* * * * *", async function () {
  let todaysDate = new Date().toISOString();
  let searchCond = {
    startdate: { $lte: todaysDate },
    enddate: { $gte: todaysDate },
  };

  let findTodaysDosage = await commonQuery.findData(dosages, searchCond);

  // findTodaysDosage.data.forEach(async function (v) {
  for (let v of findTodaysDosage.data) {
    if (v.isMedicationNotification) {
      v.morningtime;
      let medicineName;
      let toNotify = false;
      if (v.isMorning) {
        if (v.shouldSend) {
          if (
            moment(todaysDate).add(10, "minutes").format("hh:mm") ==
            moment(new Date(v.morningtime).toISOString()).format("hh:mm")
          ) {
            medicineName = v.medicineName;
            toNotify = true;
          }
          if (
            moment(todaysDate).format("hh:mm") ==
            moment(new Date(v.morningtime).toISOString()).format("hh:mm")
          ) {
            medicineName = v.medicineName;
            toNotify = true;
          }
          if (
            moment(
              todaysDate.format("hh:mm") ==
                moment(new Date(v.morningtime).toISOString())
            )
              .add(10, "minutes")
              .format("hh:mm")
          ) {
            medicineName = v.medicineName;
            toNotify = true;
          }
        }
      }
      if (v.isAfternoon) {
        if (v.shouldSend) {
          if (
            moment(todaysDate).add(10, "minutes").format("hh:mm") ==
            moment(new Date(v.afternoontime).toISOString()).format("hh:mm")
          ) {
            medicineName = v.medicineName;
            toNotify = true;
          }
          if (
            moment(todaysDate).format("hh:mm") ==
            moment(new Date(v.afternoontime).toISOString()).format("hh:mm")
          ) {
            medicineName = v.medicineName;
            toNotify = true;
          }
          if (
            moment(todaysDate).format("hh:mm") ==
            moment(new Date(v.afternoontime).toISOString())
              .add(10, "minutes")
              .format("hh:mm")
          ) {
            medicineName = v.medicineName;
            toNotify = true;
          }
        }
      }
      if (v.isEvening) {
        if (v.shouldSend) {
          if (
            moment(todaysDate).add(10, "minutes").format("hh:mm") ==
            moment(new Date(v.eveningtime).toISOString()).format("hh:mm")
          ) {
            medicineName = v.medicineName;
            toNotify = true;
          }
          if (
            moment(todaysDate).format("hh:mm") ==
            moment(new Date(v.eveningtime).toISOString()).format("hh:mm")
          ) {
            medicineName = v.medicineName;
            toNotify = true;
          }
          if (
            moment(todaysDate).format("hh:mm") ==
            moment(new Date(v.eveningtime).toISOString())
              .add(10, "minutes")
              .format("hh:mm")
          ) {
            medicineName = v.medicineName;
            toNotify = true;
          }
        }
      }
      let userId = JSON.parse(JSON.stringify(v.user_id));
      let userInfo = await commonQuery.findoneData(users, { _id: userId });
      let deviceToken = userInfo.deviceToken;

      if (toNotify) {
        var message = {
          to: deviceToken ? deviceToken : "",
          collapse_key: "your_collapse_key",
          notification: {
            title: "Medicine Remider",
            body: "Reminder for  " + medicineName + " ",
          },
          data: {
            my_key: "CURIO",
            my_another_key: "NADIM",
          },
        };
        fcm.send(message, async function (err, response) {
          if (err) {
            console.log("Something has gone wrong!", err);
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
      }
    }
  }
});

function getAppointmentRequest(req, res) {
  async function getAppointmentRequest() {
    try {
      if (req.body && req.body.user_id) {
        //her user_id is of hospital

        let condition = {
          "patientsData.hospital_id": mongoose.Types.ObjectId(req.body.user_id),
        };

        let getRequestList = await commonQuery.getPatientRequestList(
          appointmentrequests,
          condition
        );

        if (getRequestList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              getRequestList
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
  getAppointmentRequest().then(function () {});
}

function requestAppointment(req, res) {
  async function requestAppointment() {
    try {
      if (req.body && req.body.user_id) {
        let requestAppoint = new appointmentrequests({
          patient_user_id: req.body.user_id,
          caretaker_id: req.body.caretaker_id,
          appointment_time: req.body.starttime,
          appointment_end_time: req.body.endtime,
          appointment_date: req.body.date,
          isMorning: req.body.isMorning,
          isAfternoon: req.body.isAfternoon,
          isEvening: req.body.isEvening,
          morningstarttime: req.body.morningstarttime,
          morningendtime: req.body.morningendtime,
          afternoonstarttime: req.body.afternoonstarttime,
          afternoonendtime: req.body.afternoonendtime,
          eveningstarttime: req.body.eveningstarttime,
          eveningendtime: req.body.eveningendtime,
          note: req.body.note,
          sessionType: req.body.sessionType,
        });

        let saveReuestAppoint = await commonQuery.InsertIntoCollection(
          appointmentrequests,
          requestAppoint
        );

        if (saveReuestAppoint) {
          let dataToPass = {
            message: "New appointment",
            description: "Your have a new appointment request",
            name: "",
            caretakerID: req.body.caretaker_id,
          };

          addNotification(dataToPass);

          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              saveReuestAppoint
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
  requestAppointment().then(function () {});
}

function getCareTeamOfPatient(req, res) {
  async function getCareTeamOfPatient() {
    try {
      if (req.body && req.body.user_id) {
        let condition = { user_id: req.body.user_id };
        let patientData = await commonQuery.findoneData(patients, condition);

        let patient_id = patientData["_id"];

        let conditions = { _id: mongoose.Types.ObjectId(patient_id) };
        let careTeamList = await commonQuery.getPatientCareTeam(
          patients,
          conditions
        );
        if (careTeamList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              careTeamList
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
  getCareTeamOfPatient().then(function () {});
}

function assignCareTaker(req, res) {
  async function assignCareTaker() {
    try {
      if (req.body.patient_id && req.body) {
        let tempSev = [];
        req.body.careteams_id.forEach(function (v) {
          tempSev.push(mongoose.Types.ObjectId(v));
        });

        let patientID = req.body.patient_id;
        var Cond = {
          _id: patientID,
        };
        let isPatientExist = await commonQuery.findoneData(patients, Cond);

        if (isPatientExist) {
          let addCareTeam = await commonQuery.assignCareTeamToPatient(
            patients,
            patientID,
            tempSev
          );
          if (!addCareTeam) {
            res.json(
              Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
            );
          } else {
            res.json(
              Response(
                constant.SUCCESS_CODE,
                constant.ADDED_SUCCESS,
                addCareTeam
              )
            );
          }
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.USER_DOEST_NOT_EXIST, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  assignCareTaker().then(function () {});
}

function unassignCareTaker(req, res) {
  async function unassignCareTaker() {
    try {
      if (req.body.patient_id && req.body) {
        let tempSev = [];
        req.body.careteams_id.forEach(function (v) {
          tempSev.push(mongoose.Types.ObjectId(v));
        });

        let patientID = req.body.patient_id;
        var Cond = {
          _id: patientID,
        };
        let isPatientExist = await commonQuery.findoneData(patients, Cond);

        if (isPatientExist) {
          let addCareTeam = await commonQuery.unassignCareTeamPatient(
            patients,
            patientID,
            tempSev
          );
          if (!addCareTeam) {
            res.json(
              Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
            );
          } else {
            res.json(
              Response(
                constant.SUCCESS_CODE,
                constant.ADDED_SUCCESS,
                addCareTeam
              )
            );
          }
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.USER_DOEST_NOT_EXIST, null)
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  unassignCareTaker().then(function () {});
}

function getCareTaker(req, res) {
  async function getCareTaker() {
    try {
      if (req.body && req.body.user_id) {
        let getAssisgenedCaretaker = {
          _id: mongoose.Types.ObjectId(req.body.patient_id),
        };
        let assignedCareTaker = await commonQuery.findoneData(
          patients,
          getAssisgenedCaretaker
        );

        let condition = { user_id: mongoose.Types.ObjectId(req.body.user_id) };

        let hospitalDetail = await commonQuery.findoneData(
          hospitals,
          condition
        );

        let hospitalId = hospitalDetail._id;

        let conditions = {
          hospital_id: hospitalId,
        };

        let caretakerlist = await commonQuery.getCareTaker(
          caretakerhospitals,
          conditions
        );

        if (caretakerlist) {
          if (assignedCareTaker.caretaker_id.length > 0) {
            caretakerlist.map((x) => {
              assignedCareTaker.caretaker_id.forEach((y) => {
                if (JSON.stringify(x.caretaker_id) == JSON.stringify(y)) {
                  x.user[0].isAssigned = true;
                }
              });
            });
          }

          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              caretakerlist
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
  getCareTaker().then(function () {});
}

function getSpecialization(req, res) {
  async function getSpecialization() {
    try {
      if (req.body && req.body.type === "specializations") {
        let condition = { islive: true };
        let specializationsList = await commonQuery.findAll(
          specializations,
          condition
        );

        if (specializationsList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              specializationsList
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
  getSpecialization().then(function () {});
}

function addCareTaker(req, res) {
  async function addCareTaker() {
    try {
      let hospital_id;
      if (req.body && req.body.user_id) {
        let saveCareTaker = new caretakers({
          category: req.body.category,
          description: req.body.description,
          qualification: req.body.qualification,
          user_id: req.body.user_id,
          registrationNumber: req.body.registrationNumber,
          rating: req.body.rating,
          specialization_id: req.body.specialization_id,
        });

        let saveCareTakerData = await commonQuery.InsertIntoCollection(
          caretakers,
          saveCareTaker
        );
        if (saveCareTakerData) {
          let caretaker_id = saveCareTakerData._id;
          // let condition = {
          //   user_id: mongoose.Types.ObjectId(req.body.hospital_id),
          // };
          // let hospitalDetails = await commonQuery.findoneData(
          //   hospitals,
          //   condition
          // );
          // if (hospitalDetails) {
          //   hospital_id = hospitalDetails._id;
          // }
          let saveCareTakerHospital = new caretakerhospitals({
            caretaker_id: caretaker_id,
            hospital_id: req.body.hospital_id,
          });
          let saveCareTakerHospitalData = await commonQuery.InsertIntoCollection(
            caretakerhospitals,
            saveCareTakerHospital
          );
          if (saveCareTakerHospitalData) {
            let saveCareTakerSpecialization = new caretakerspecializations({
              specialization_id: req.body.specialization_id,
              caretaker_id: caretaker_id,
            });

            if (saveCareTakerSpecialization) {
              res.json(
                Response(
                  constant.SUCCESS_CODE,
                  constant.ADDED_SUCCESS,
                  saveCareTakerData
                )
              );
            } else {
              res.json(
                Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
              );
            }
          }
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  addCareTaker().then(function () {});
}

function addSepcialization(req, res) {
  async function addSepcialization() {
    try {
      if (req.body && req.body.specialization) {
        let saveSpecialization = new specializations({
          specialization: req.body.specialization,
          description: req.body.description,
        });

        let saveSpecializationData = await commonQuery.InsertIntoCollection(
          specializations,
          saveSpecialization
        );

        if (saveSpecializationData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              saveSpecializationData
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
  addSepcialization().then(function () {});
}

function getPatientSearch(req, res) {
  async function getPatientSearch() {
    try {
      let hospital_id;
      if (req.body && req.body.user_id) {
        // if(req.body.userType=="hospital"){
          let condition = {
            hospital_id: mongoose.Types.ObjectId(req.body.user_id),
          };
          var regexText = new RegExp(req.body.isSearch, "i");
          // let patientsList;

          if(req.body.userType=="hospital"){
  
          let patientsList = await patients
            .aggregate([
              {
                $match: {
                  hospital_id: mongoose.Types.ObjectId(req.body.user_id),
                },
              },
              {
                $lookup: {
                  from: "users",
                  let: { userId: "$user_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$_id", "$$userId"] },
                            { $eq: ["$islive", true] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "patient",
                },
              },
              {
                $unwind: "$patient",
              },
              {
                $project: {
                  user_id: 1,
                  islive: 1,
                  notes: 1,
                  hospital_id: 1,
                  firstName: "$patient.firstName",
                  lastName: "$patient.lastName",
                  middleName: "$patient.middleName",
                  gender: "$patient.gender",
                  profession: "$patient.profession",
                  phoneCountry: "$patient.Country",
                  phoneNumber: "$patient.phoneNumber",
                  email: "$patient.email",
                  fullName: {
                    $concat: [
                      "$patient.firstName",
                      " ",
                      "$patient.middleName",
                      " ",
                      "$patient.lastName",
                    ],
                  },
                },
              },
              {
                $match: { fullName: regexText },
              },
            ])
            .exec();
  
          if (patientsList) {
            res.json(
              Response(
                constant.SUCCESS_CODE,
                constant.FETCH_SUCCESS,
                patientsList
              )
            );
          } else {
            res.json(
              Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
            );
          }

        }
        else{

          let patientsList = await caretakers.aggregate([
            {
              $match: { "user_id": mongoose.Types.ObjectId(req.body.user_id) }
            },
            {
              $project: { "user_id": 1, "id": "$_id" }
            },

            {
              $lookup: {
                from: "patients",
                let: { "id": "$id" },
                pipeline: [
                  { $match: { $expr: { $and: { "$ifNull": ["$caretaker_id", false] } } } },
                  {
                    "$match": { "$expr": { "$in": ["$$id", "$caretaker_id"] } }
                  }
                ],

                as: "userinfo"
              }
            },
            {
              $unwind: "$userinfo"
            },
            {
              $lookup: {
                from: "users",
                localField: "userinfo.user_id",
                foreignField: "_id",
                as: "patient"

              }
            },
            {
              $unwind: "$patient"
            },
            {
              $project: {
                user_id: "$patient._id",
                caretaker_id: "$id",
                islive: "$userinfo.islive",
                notes: "$userinfo.notes",
                hospital_id: "$userinfo.hospital_id",
                firstName: "$patient.firstName",
                lastName: "$patient.lastName",
                middleName: "$patient.middleName",
                gender: "$patient.gender",
                profession: "$patient.profession",
                phoneCountry: "$patient.Country",
                phoneNumber: "$patient.phoneNumber",
                email: "$patient.email",
                isNotificationAble: "$patient.isNotificationAble",
                userType: "$patient.userType"
              }
            },
            {
              $match: { firstName: regexText },
            },

          ]).exec();

          if (patientsList) {
            res.json(
              Response(
                constant.SUCCESS_CODE,
                constant.FETCH_SUCCESS,
                patientsList
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
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  getPatientSearch().then(function () {});
}

function getPatients(req, res) {
  async function getPatients() {
    try {
      let hospital_id;
      var patientList;
      if (req.body && req.body.user_id) {
        let condition = {
          hospital_id: mongoose.Types.ObjectId(req.body.user_id)
        };

        if (req.body && req.body.userType == "hospital") {
          patientList = await commonQuery.getPatientOfHospital(
            patients,
            condition
          );

        }
        else {

          patientList = await caretakers.aggregate([
            {
              $match: { "user_id": mongoose.Types.ObjectId(req.body.user_id) }
            },
            {
              $project: { "user_id": 1, "id": "$_id" }
            },

            {
              $lookup: {
                from: "patients",
                let: { "id": "$id" },
                pipeline: [
                  { $match: { $expr: { $and: { "$ifNull": ["$caretaker_id", false] } } } },
                  {
                    "$match": { "$expr": { "$in": ["$$id", "$caretaker_id"] } }
                  }
                ],

                as: "userinfo"
              }
            },
            {
              $unwind: "$userinfo"
            },
            {
              $lookup: {
                from: "users",
                localField: "userinfo.user_id",
                foreignField: "_id",
                as: "patient"

              }
            },
            {
              $unwind: "$patient"
            },
            {
              $project: {
                user_id: "$patient._id",
                caretaker_id: "$id",
                islive: "$userinfo.islive",
                notes: "$userinfo.notes",
                hospital_id: "$userinfo.hospital_id",
                firstName: "$patient.firstName",
                lastName: "$patient.lastName",
                middleName: "$patient.middleName",
                gender: "$patient.gender",
                profession: "$patient.profession",
                phoneCountry: "$patient.Country",
                phoneNumber: "$patient.phoneNumber",
                email: "$patient.email",
                isNotificationAble: "$patient.isNotificationAble",
                userType: "$patient.userType"
              }
            }

          ]);
        }

        if (patientList) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              patientList
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
  getPatients().then(function () { });
}

function getDosages(req, res) {
  async function getDosages() {
    try {
      if (req.body && req.body.user_id) {
        let condition = { user_id: mongoose.Types.ObjectId(req.body.user_id) };

        dosages
          .find(condition)
          .sort({ updatedAt: -1 })
          .exec(function (err, result) {
            if (err) {
              res.json(
                Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
              );
            } else {
              res.json(
                Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, result)
              );
            }
          });

        // let getDosagesList = await commonQuery.findAll(dosages, condition);

        // if (getDosagesList) {
        //   getDosagesList.dosage_id = undefined;
        //   res.json(
        //     Response(
        //       constant.SUCCESS_CODE,
        //       constant.FETCH_SUCCESS,
        //       getDosagesList
        //     )
        //   );
        // } else {
        //   res.json(
        //     Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
        //   );
        // }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  getDosages().then(function () {});
}

function addDosage(req, res) {
  async function addDosage() {
    try {
      let medName;
      let morningTime;
      let afternoonTime;
      let eveningTIme;

      if (req.body && req.body.medicine_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.medicine_id) };

        let medNameObj = await commonQuery.findoneData(medicines, condition);
        if (medNameObj) {
          medName = medNameObj.medicineName;

          if (req.body.isMorning === true) {
            let morDate = new Date();

            morDate.setHours("09", "00", "00");

            morningTime = morDate.toISOString();
          } else {
            morningTime = null;
          }

          if (req.body.isAfternoon === true) {
            let afterDate = new Date();

            afterDate.setHours("13", "00", "00");

            afternoonTime = afterDate.toISOString();
          } else {
            afternoonTime = null;
          }
          if (req.body.isEvening === true) {
            let eveDate = new Date();

            eveDate.setHours("21", "00", "00");

            eveningTIme = eveDate.toISOString();
          } else {
            eveningTIme = null;
          }

          let saveDOsage = new dosages({
            medicine_id: req.body.medicine_id,
            frequency: req.body.frequency,
            dateTime: req.body.datetime,
            details: req.body.details,
            sideEffectDetails: req.body.sideEffectDetails,
            bufferTime: req.body.bufferTime,
            reminderTime: req.body.reminderTime,
            medicineName: medName,
            user_id: req.body.user_id,
            startdate: req.body.startdate,
            morningtime: morningTime,
            afternoontime: afternoonTime,
            eveningtime: eveningTIme,
            enddate: req.body.enddate,
            medType: req.body.medType,
            isMorning: req.body.isMorning,
            isAfternoon: req.body.isAfternoon,
            isEvening: req.body.isEvening,
          });

          let saveDosageDetails = await commonQuery.InsertIntoCollection(
            dosages,
            saveDOsage
          );
          if (saveDosageDetails) {
            let patient_id;

            let condition = { user_id: req.body.user_id };
            let findPatient = await commonQuery.findoneData(
              patients,
              condition
            );

            if (findPatient) {
              patient_id = findPatient._id;

              let updateCond = { deviceToken: findPatient.deviceToken };
              let cond = { _id: saveDosageDetails._id };

              let updateDos = await commonQuery.updateOne(
                dosages,
                cond,
                updateCond
              );
              if (updateDos) {
                console.log("devicetoken");
              }

              let pushDosageId = await commonQuery.addDosageToPatient(
                patients,
                patient_id,
                saveDosageDetails._id
              );
              if (pushDosageId) {
              } else {
                res.json(
                  Response(
                    constant.ERROR_CODE,
                    constant.FAILED_TO_PROCESS,
                    "here"
                  )
                );
              }
            }

            res.json(
              Response(
                constant.SUCCESS_CODE,
                constant.ADDED_SUCCESS,
                saveDosageDetails
              )
            );
          } else {
            res.json(
              Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, "there")
            );
          }
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, "never")
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }
  addDosage().then(function () {});
}

function addMedicines(req, res) {
  async function addMedicines() {
    try {
      if (req.body && req.body.medicineName) {
        let saveMedicine = new medicines({
          medicineName: req.body.medicineName,
          code: req.body.code,
          type: req.body.type,
        });

        let saveMedicineData = await commonQuery.InsertIntoCollection(
          medicines,
          saveMedicine
        );
        if (saveMedicineData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              saveMedicineData
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
  addMedicines().then(function () {});
}

function saveHospital(req, res) {
  async function saveHospital() {
    try {
      if (req.body && req.body.user_id) {
        let hospitalData = new hospitals({
          hospitalName: req.body.hospitalName,
          user_id: mongoose.Types.ObjectId(req.body.user_id),
          address_id: mongoose.Types.ObjectId(req.body.address_id),
          registerationNumber: req.body.registerationNumber,
          rating: req.body.rating,
          description: req.body.description,
          islive: true,
          hospitalValidTo: req.body.hospitalValidTo,
          hospitalValidFrom: req.body.hospitalValidFrom,
        });

        let saveHospitalData = await commonQuery.InsertIntoCollection(
          hospitals,
          hospitalData
        );
        if (saveHospitalData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              saveHospitalData
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
  saveHospital().then(function () {});
}

function addHobbies(req, res) {
  async function addHobbies() {
    try {
      if (req.body && req.body.hobby) {
        let hobbyData = new hobbies({
          hobby: req.body.hobby,
          notes: req.body.notes,
          category: req.body.category,
        });

        let saveHobbyData = await commonQuery.InsertIntoCollection(
          hobbies,
          hobbyData
        );
        if (saveHobbyData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              saveHobbyData
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
  addHobbies().then(function () {});
}
function getHobbies(req, res) {
  async function getHobbies() {
    try {
      if (req.body && req.body.type === "hobbies") {
        let condition = { islive: true };

        let hobbiesList = await commonQuery.findAll(hobbies, condition);
        if (hobbiesList) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, hobbiesList)
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
  getHobbies().then(function () {});
}

function selectHobbies(req, res) {
  async function selectHobbies() {
    try {
      let hobbyName;
      if (req.body && req.body.hobby_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.hobby_id) };

        let hobbyData = await commonQuery.findoneData(hobbies, condition);

        if (hobbyData) {
          hobbyName = hobbyData.hobby;
        }

        let saveUserHobbies = new userHobbies({
          hobbyname: hobbyName,
          hobby_id: req.body.hobby_id,
          user_id: req.body.user_id,
        });

        let saveUserHobbiesData = await commonQuery.InsertIntoCollection(
          userHobbies,
          saveUserHobbies
        );
        if (saveUserHobbiesData) {
          let condition = { _id: mongoose.Types.ObjectId(req.body.user_id) };
          let updateData = { isHobbies: true };

          let updateHobby = await commonQuery.updateOne(
            users,
            condition,
            updateData
          );
          if (updateHobby) {
          }

          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              saveUserHobbiesData
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
  selectHobbies().then(function () {});
}

function getNotification(req, res) {
  async function getNotification() {
    try {
      if (req.body && req.body.type === "notification") {
        let condition = {
          isRead: false,
          user_id: mongoose.Types.ObjectId(req.body.user_id),
        };

        let getNotificationList = await commonQuery.fetch_all(
          notifications,
          condition
        );

        let countN = await commonQuery.findCount(notifications, condition);

        let dataToPass = {
          notifications: getNotificationList,
          count: countN,
        };

        if (getNotificationList) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, dataToPass)
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
  getNotification().then(function () {});
}

function addNotification(data) {
  async function addNotification() {
    try {
      if (data.message) {
        let condition = {
          caretaker_id: mongoose.Types.ObjectId(data.caretakerID),
        };

        let getUserDetail = await commonQuery.getUserIdForNotifications(
          caretakerhospitals,
          condition
        );

        let dataToSave = new notifications({
          message: data.message,
          name: data.name,
          description: data.description,
          user_id: getUserDetail[0].user_id,
        });

        let saveNotification = await commonQuery.InsertIntoCollection(
          notifications,
          dataToSave
        );

        if (saveNotification) {
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  addNotification().then(function () {});
}

function addProgram(req, res) {
  async function addProgram() {
    try {
      if (req.body && req.body.programname) {
        let saveProgram = new programs({
          programname: req.body.programname,
          hospital_user_id: req.body.hospital_user_id,
          lmsprogram_id: req.body.lmsprogram_id,
          lmsinstance_id: req.body.lmsinstance_id,
        });

        let addPrograms = await commonQuery.InsertIntoCollection(
          programs,
          saveProgram
        );

        if (addPrograms) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, addPrograms)
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
  addProgram().then(function () {});
}

function addSymptoms(req, res) {
  async function addSymptoms() {
    try {
      if (req.body && req.body.symptom) {
        let saveProgram = new symptoms({
          program_id: req.body.program_id,
          symptom: req.body.symptom,
          priority: req.body.priority,
          title: req.body.symptom,
        });

        let addQuestion = await commonQuery.InsertIntoCollection(
          symptoms,
          saveProgram
        );

        if (addQuestion) {
          let tempArray = [];
          let id = mongoose.Types.ObjectId(req.body.program_id);

          tempArray.push(addQuestion._id);

          let dataToAdd = tempArray;

          let addToProgram = await commonQuery.addToArrayNew(
            programs,
            id,
            dataToAdd
          );

          res.json(
            Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, addQuestion)
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
  addSymptoms().then(function () {});
}

function addSideEffect(req, res) {
  async function addSideEffect() {
    try {
      if (req.body && req.body.sideeffect) {
        let saveProgram = new sideeffects({
          sideeffect: req.body.sideeffect,
          program_id: req.body.program_id,
          priority: req.body.priority,
          title: req.body.sideeffect,
        });

        let addQuestion = await commonQuery.InsertIntoCollection(
          sideeffects,
          saveProgram
        );

        if (addQuestion) {
          let tempArray = [];
          let id = mongoose.Types.ObjectId(req.body.program_id);

          tempArray.push(addQuestion._id);

          let dataToAdd = tempArray;

          let addToProgram = await commonQuery.addToArray(
            programs,
            id,
            dataToAdd
          );
          if (addToProgram) {
          } else {
            console.log("error");
          }

          res.json(
            Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, addQuestion)
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
  addSideEffect().then(function () {});
}

function getSymptpmsAndSideEffects(req, res) {
  async function getSymptpmsAndSideEffects() {
    try {
      if (req.body && req.body.user_id) {
        let addedData;
        let user_id = mongoose.Types.ObjectId(req.body.user_id);

        let dateComing = req.body.date;

        let startDate = new Date(dateComing).setHours(0, 0, 0, 0);

        let endDate = new Date(dateComing).setHours(23, 59, 59, 999);

        let checkIfData = await commonQuery.findSymptoms(
          responses,
          user_id,
          startDate,
          endDate
        );

        if (checkIfData) {
          addedData = checkIfData;
        } else {
          addedData = null;
        }

        let condition_id = mongoose.Types.ObjectId(req.body.user_id);

        let symptomList = await commonQuery.fetchSymptomsSideEffect(
          programs,
          condition_id
        );

        if (symptomList) {
          if (addedData != null) {
            addedData.map((x) => {
              x.sideeffect_id = [];
              x.symptoms_id = [];
              x.responses_id.forEach((y) => {
                let symptomLst = JSON.parse(
                  JSON.stringify(symptomList[0].sideeffect_id)
                );
                if (symptomLst.includes(JSON.parse(JSON.stringify(y)))) {
                  x.sideeffect_id.push(y);
                } else {
                  x.symptoms_id.push(y);
                }
              });
            });
          }
          let dataToSend = {
            list: symptomList,
            data: addedData,
          };

          res.json(
            Response(constant.SUCCESS_CODE, constant.FETCH_SUCESS, dataToSend)
          );
        } else {
          res.json(
            Response(
              constant.ERROR_CODE,
              constant.REQUIRED_FIELDS_MISSING,
              null
            )
          );
        }
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  getSymptpmsAndSideEffects().then(function () {});
}

function respondOfSymptoms(req, res) {
  async function respondOfSymptoms() {
    try {
      if (req.body && req.body.date) {

        let checkDoc = {
          user_id: req.body.user_id,
          date: req.body.date
        };

        let toUpdate = {}

        if(req.body.responseid){
          toUpdate.responses_id = req.body.responseid
        }
        
          toUpdate.mood = req.body && req.body.mood
        

        let saveData = await commonQuery.updateAndUpsert(responses,checkDoc,toUpdate);
        
        // let saveResponse = new responses({
        //   user_id: req.body.user_id,
        //   date: req.body.date,
        //   program_id: req.body.program_id
        // });
        // let mood = req.body && req.body.mood 

        // let saveAddResponse = await commonQuery.InsertIntoCollection(
        //   responses,
        //   saveResponse
        // );

        // if (saveAddResponse) {
        //   let id = saveAddResponse._id;

        //   // tempArray.push(addQuestion._id);

        //   // let dataToAdd = tempArray;
        //   // console.log("DATA", dataToAdd);

        //   // console.log("id", id, "ToId", dataToAdd);

        //   let addToProgram = await commonQuery.responseQuery(
        //     responses,
        //     id,
        //     req.body.responseid,
        //     mood

        //   );
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              saveData
            )
          );
        } else {
          res.json(
            Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
          );
        }
      
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  respondOfSymptoms().then(function () {});
}

function getPrograms(req, res) {
  async function getPrograms() {
    try {
      let condition = {
        hospital_user_id: mongoose.Types.ObjectId(req.body.hospital_user_id),
        isActive: true,
      };

      let getListOfProgram = await commonQuery.fetch_all(programs, condition);

      if (getListOfProgram) {
        res.json(
          Response(
            constant.SUCCESS_CODE,
            constant.FETCH_SUCCESS,
            getListOfProgram
          )
        );
      } else {
        res.json(
          Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
        );
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
      );
    }
  }
  getPrograms().then(function () {});
}

function updateProgram(req, res) {
  async function updateProgram() {
    try {
      if (req.body && req.body.program_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.program_id) };

        let updateData = { programname: req.body.programname };

        if (req.body.lmsinstance_id && req.body.lmsprogram_id) {
          (updateData.lmsprogram_id = req.body.lmsprogram_id),
            (updateData.lmsinstance_id = req.body.lmsinstance_id);
        }

        let updateProgramData = await commonQuery.updateOne(
          programs,
          condition,
          updateData
        );

        if (updateProgramData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              updateProgramData
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
  updateProgram().then(function () {});
}

function deleteProgram(req, res) {
  async function deleteProgram() {
    try {
      if (req.body && req.body.program_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.program_id) };

        let updateData = { isActive: false };

        let updateProgramData = await commonQuery.updateOne(
          programs,
          condition,
          updateData
        );

        if (updateProgramData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.DELETE_SUCCESS,
              updateProgramData
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
  deleteProgram().then(function () {});
}

function getSymptom(req, res) {
  async function getSymptom() {
    try {
      if (req.body && req.body.program_id) {
        let condition = {
          program_id: mongoose.Types.ObjectId(req.body.program_id),
          isActive: true,
          isDeleted: false,
        };

        let symptomList = await commonQuery.fetch_all(symptoms, condition);
        if (symptomList) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, symptomList)
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

  getSymptom().then(function () {});
}

function getSideEffect(req, res) {
  async function getSideEffect() {
    try {
      if (req.body && req.body.program_id) {
        let condition = {
          program_id: mongoose.Types.ObjectId(req.body.program_id),
          isActive: true,
          isDeleted: false,
        };

        let symptomList = await commonQuery.fetch_all(sideeffects, condition);
        if (symptomList) {
          res.json(
            Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, symptomList)
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

  getSideEffect().then(function () {});
}

function updateSymptom(req, res) {
  async function updateSymptom() {
    try {
      if (req.body && req.body.symptom_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.symptom_id) };

        let updateData = {
          symptom: req.body.symptom,
          title: req.body.symptom,
          priority: req.body.priority,
        };

        let updateProgramData = await commonQuery.updateOne(
          symptoms,
          condition,
          updateData
        );

        if (updateProgramData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              updateProgramData
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
  updateSymptom().then(function () {});
}

function deleteSymptom(req, res) {
  async function deleteSymptom() {
    try {
      if (req.body && req.body.symptom_id) {
        let condition = { _id: mongoose.Types.ObjectId(req.body.symptom_id) };

        let updateData = { isActive: false, isDeleted: true };

        let updateProgramData = await commonQuery.updateOne(
          symptoms,
          condition,
          updateData
        );

        if (updateProgramData) {
          let programId = mongoose.Types.ObjectId(req.body.program_id);
          let symptom = mongoose.Types.ObjectId(req.body.symptom_id);
          let updateProgram =await programs.findByIdAndUpdate({_id:programId},
            { $pull: {symptoms_id: symptom} });

          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.DELETE_SUCCESS,
              updateProgramData
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
  deleteSymptom().then(function () {});
}

function updateSideEffect(req, res) {
  async function updateSideEffect() {
    try {
      if (req.body && req.body.sideeffect_id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body.sideeffect_id),
        };

        let updateData = {
          symptom: req.body.symptom,
          title: req.body.sideeffect,
          title: req.body.sideeffect,
          priority: req.body.priority,
        };

        let updateProgramData = await commonQuery.updateOne(
          sideeffects,
          condition,
          updateData
        );

        if (updateProgramData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              updateProgramData
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
  updateSideEffect().then(function () {});
}

function deleteSideEffect(req, res) {
  async function deleteSideEffect() {
    try {
      if (req.body && req.body.sideeffect_id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body.sideeffect_id),
        };

        let updateData = { isActive: false, isDeleted: true };

        let updateProgramData = await commonQuery.updateOne(
          sideeffects,
          condition,
          updateData
        );

        if (updateProgramData) {
          let programId = mongoose.Types.ObjectId(req.body.program_id);
          let sideEffct = mongoose.Types.ObjectId(req.body.sideeffect_id);
          let updateProgram =await programs.findByIdAndUpdate({_id:programId},
            { $pull: {sideeffect_id: sideEffct} });
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.DELETE_SUCCESS,
              updateProgramData
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
  deleteSideEffect().then(function () {});
}
function getMonthlySymptomSideEffectAnalysis(req, res) {
  async function getMonthlySymptomSideEffectAnalysis() {
    try {
      if (req.body && req.body.user_id) {
        let condition_id = {
          connected_user_id: mongoose.Types.ObjectId(req.body.user_id),
        };
        let symptonList = await commonQuery.findoneData(programs, condition_id);
        let currentDate = new Date(req.body.date).toISOString();

        let startOfMonth = moment(currentDate).startOf("month").format();

        let endOfMonth = moment(currentDate).endOf("month").format();
        let cond = {
          user_id: mongoose.Types.ObjectId(req.body.user_id),
          date: {
            $gte: new Date(startOfMonth),
            $lte: new Date(endOfMonth),
          },
        };

        let allDatabetweenDate = await commonQuery.findAll(responses, cond);
        let highRisk = [];
        let mediumRisk = [];
        let lowRisk = [];
        let commonArray = [];
        let commonObjArray = [];
        let highCount = 0;
        let lowCount = 0;
        let mediumCount = 0;
        let symptomFreeArray = [];
        let symptomFree = [];
        let symptonFreeCount = 0;
        let freeDate = [];
        let freeCount = 0;
        for (let eachResponses of allDatabetweenDate) {
          if (eachResponses.responses_id.length > 0) {
            let sympton = false;
            let symptomLst = JSON.parse(
              JSON.stringify(symptonList.sideeffect_id)
            );
            let symptomId = JSON.parse(JSON.stringify(symptonList.symptoms_id));
            eachResponses.responses_id.forEach((x) => {
              if (symptomId.includes(JSON.parse(JSON.stringify(x)))) {
                sympton = true;
              }
            });
            if (sympton) {
              for (let y of eachResponses.responses_id) {
                if (commonArray.indexOf(JSON.parse(JSON.stringify(y))) == -1) {
                  if (symptomLst.includes(JSON.parse(JSON.stringify(y)))) {
                    let eachId = JSON.parse(JSON.stringify(y));
                    let obj = { _id: mongoose.Types.ObjectId(eachId) };
                    let data = await commonQuery.findoneData(sideeffects, obj);
                    let data1 = { id: data.id, priority: data.priority };
                    commonArray.push(data.id);
                    commonObjArray.push(data1);
                    if (data.priority == "High") {
                      highCount++;
                      if (highRisk.indexOf(eachResponses.date) == -1) {
                        highRisk.push(eachResponses.date);
                      }
                    }
                    if (data.priority == "Medium") {
                      mediumCount++;
                      if (mediumRisk.indexOf(eachResponses.date) == -1) {
                        mediumRisk.push(eachResponses.date);
                      }
                    }
                    if (data.priority == "Low") {
                      lowCount++;
                      if (lowRisk.indexOf(eachResponses.date) == -1) {
                        lowRisk.push(eachResponses.date);
                      }
                    }
                  } else {
                    let eachId = JSON.parse(JSON.stringify(y));
                    let obj = { _id: mongoose.Types.ObjectId(eachId) };
                    let data = await commonQuery.findoneData(symptoms, obj);
                    let data1 = { id: data.id, priority: data.priority };
                    commonArray.push(data.id);
                    commonObjArray.push(data1);
                    if (data.priority == "High") {
                      highCount++;
                      if (highRisk.indexOf(eachResponses.date) == -1) {
                        highRisk.push(eachResponses.date);
                      }
                    }
                    if (data.priority == "Medium") {
                      mediumCount++;
                      if (highRisk.indexOf(eachResponses.date) == -1) {
                        mediumRisk.push(eachResponses.date);
                      }
                    }
                    if (data.priority == "Low") {
                      lowCount++;
                      if (highRisk.indexOf(eachResponses.date) == -1) {
                        lowRisk.push(eachResponses.date);
                      }
                    }
                  }
                } else {
                  commonObjArray.forEach((eachObj) => {
                    if (eachObj.id == JSON.parse(JSON.stringify(y))) {
                      if (eachObj.priority == "High") {
                        highCount++;
                        if (highRisk.indexOf(eachResponses.date) == -1) {
                          highRisk.push(eachResponses.date);
                        }
                      }
                      if (eachObj.priority == "Medium") {
                        mediumCount++;
                        if (mediumRisk.indexOf(eachResponses.date) == -1) {
                          mediumRisk.push(eachResponses.date);
                        }
                      }
                      if (eachObj.priority == "Low") {
                        lowCount++;
                        if (lowRisk.indexOf(eachResponses.date) == -1) {
                          lowRisk.push(eachResponses.date);
                        }
                      }
                    }
                  });
                }
              }
            } else {
              if (symptomFree.indexOf(eachResponses.date) == -1) {
                symptomFree.push(eachResponses.date);
              }
              symptonFreeCount++;
            }
          } else {
            if (freeDate.indexOf(eachResponses.date) == -1) {
              freeDate.push(eachResponses.date);
            }
            freeCount++;
          }
        }
        let resObj = {
          high: {
            highRiskDate: highRisk,
            highRiskCount: highRisk.length,
            totalHighRiskResponse: highCount,
          },
          medium: {
            mediumRiskDate: mediumRisk,
            mediumRiskCount: mediumRisk.length,
            totalMediumRiskResponse: mediumCount,
          },
          low: {
            lowRiskDate: highRisk,
            lowRiskCount: lowRisk.length,
            totalLowRiskResponse: lowCount,
          },
          symptomFree: {
            symptomFreeDate: symptomFree,
            symptomFreeCount: symptonFreeCount,
          },
          free: {
            freeDate: freeDate,
            freeCount: freeCount,
          },
        };
        res.json(
          Response(constant.SUCCESS_CODE, constant.ADDED_SUCCESS, resObj)
        );
      }
    } catch (error) {
      res.json(
        Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, error)
      );
    }
  }

  getMonthlySymptomSideEffectAnalysis().then(function () {});
}

function hospitalTimingSettings(req, res) {
  async function hospitalTimingSettings() {
    try {
      if (req.body && req.body.user_id) {
        let saveSettings = new hospitalsettings({
          user_id: req.body.user_id,
          isMorning: req.body.isMorning,
          isAfternoon: req.body.isAfternoon,
          isEvening: req.body.isEvening,
          morningstarttime: req.body.morningstarttime,
          morningendtime: req.body.morningendtime,
          afternoonstarttime: req.body.afternoonstarttime,
          afternoonendtime: req.body.afternoonendtime,
          eveningstarttime: req.body.eveningstarttime,
          eveningendtime: req.body.eveningendtime,
        });

        let saveSettingData = await commonQuery.InsertIntoCollection(
          hospitalsettings,
          saveSettings
        );

        if (saveSettingData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              saveSettingData
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

  hospitalTimingSettings().then(function () {});
}

function getHospitalTiming(req, res) {
  async function getHospitalTiming() {
    try {
      if (req.body && req.body.hospital_id) {
        let condition = {
          user_id: mongoose.Types.ObjectId(req.body.hospital_id),
        };

        let getHospitalSetting = await commonQuery.fetch_all(
          hospitalsettings,
          condition
        );

        if (getHospitalSetting) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.FETCH_SUCCESS,
              getHospitalSetting
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

  getHospitalTiming().then(function () {});
}

function updateTimingSetting(req, res) {
  async function updateTimingSetting() {
    try {
      if (req.body && req.body.user_id) {
        let condition = { user_id: req.body.user_id };

        let dataToUpdate = {
          isMorning: req.body.isMorning,
          isAfternoon: req.body.isAfternoon,
          isEvening: req.body.isEvening,
          morningstarttime: req.body.morningstarttime,
          morningendtime: req.body.morningendtime,
          afternoonstarttime: req.body.afternoonstarttime,
          afternoonendtime: req.body.afternoonendtime,
          eveningstarttime: req.body.eveningstarttime,
          eveningendtime: req.body.eveningendtime,
        };

        let saveSettingData = await commonQuery.updateOne(
          hospitalsettings,
          condition,
          dataToUpdate
        );

        if (saveSettingData) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              saveSettingData
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

  updateTimingSetting().then(function () {});
}

function sendMotivations(req, res) {
  // console.log("RWQQ", req.body);
  async function sendMotivations() {
    try {
      if (req.body && req.body.user_id) {
        let createMotivation = new motivations({
          title: req.body.title,
          motivation: req.body.motivation,
          caretaker_id: req.body.caretaker_id,
          hospital_id: req.body.user_id,
        });
        let saveMotivation = await commonQuery.InsertIntoCollection(
          motivations,
          createMotivation
        );
        let patientIds = [];

        req.body.patient_ids.forEach(function (n) {
          patientIds.push(mongoose.Types.ObjectId(n));
        });

        // console.log("Patiend Idss", patientIds, saveMotivation);

        if (saveMotivation) {
          await motivations.findByIdAndUpdate(
            saveMotivation._id,
            { $push: { patient_ids: patientIds } },
            { safe: true, upsert: true }
          );

          patientIds.forEach(async function (v) {
            // console.log("IDS", v);
            let condition = { _id: v };
            let fetchPatientsDeviceToken = await commonQuery.findoneData(
              users,
              condition
            );
            // console.log("FETC", fetchPatientsDeviceToken);
            if (fetchPatientsDeviceToken) {
              var message = {
                to: fetchPatientsDeviceToken.deviceToken
                  ? fetchPatientsDeviceToken.deviceToken
                  : "",
                collapse_key: "your_collapse_key",
                notification: {
                  title: saveMotivation.title,
                  body: saveMotivation.motivation,
                },
                data: {
                  my_key: "CURIO",
                  my_another_key: "NADIM",
                },
              };
              fcm.send(message, async function (err, response) {
                if (err) {
                  // console.log("Something has gone wrong!", err);
                } else {
                  // console.log("Successfully sent with response: ", response);
                }
              });
            }
          });

          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.ADDED_SUCCESS,
              saveMotivation
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

  sendMotivations().then(function () {});
}

function getCareTakerOfHospitals(req, res) {
  async function getCareTakerOfHospitals() {
    try {
      if (req.body && req.body.hospital_id) {
        caretakerhospitals
          .aggregate([
            {
              $match: {
                hospital_id: mongoose.Types.ObjectId(req.body.hospital_id),
              },
            },

            {
              $lookup: {
                from: "caretakers",
                localField: "caretaker_id",
                foreignField: "_id",
                as: "data",
              },
            },
            { $unwind: "$data" },
            {
              $lookup: {
                from: "specializations",
                localField: "data.specialization_id",
                foreignField: "_id",
                as: "speci",
              },
            },
            { $unwind: "$speci" },

            {
              $lookup: {
                from: "users",
                localField: "data.user_id",
                foreignField: "_id",
                as: "caretakerDetails",
              },
            },

            { $unwind: "$caretakerDetails" },

            {
              $project: {
                firstName: "$caretakerDetails.firstName",
                lastName: "$caretakerDetails.lastName",
                caretaker_id: "$caretaker_id",
                hospital_id: "$hospital_id",
                category: "$data.category",
                registrationNumber: "$data.registrationNumber",
                rating: "$data.rating",
                specialization: "$speci.specialization",
                email: "$caretakerDetails.email",
                phoneNumber: "$caretakerDetails.phoneNumber",
                profession: "$caretakerDetails.profession",
                gender: "$caretakerDetails.gender",
                middleName: "$caretakerDetails.middleName",
                islive: "$caretakerDetails.islive",
                caretaker_user_id: "$caretakerDetails._id",
              },
            },
          ])
          .exec(async function (err, result) {
            if (err) {
              res.json(
                Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, error)
              );
            } else {
              if (req.body.patient_id && result) {
                let getAssisgenedCaretaker = {
                  _id: mongoose.Types.ObjectId(req.body.patient_id),
                };
                let assignedCareTaker = await commonQuery.findoneData(
                  patients,
                  getAssisgenedCaretaker
                );
                if (assignedCareTaker.caretaker_id.length > 0) {
                  result.map((x) => {
                    assignedCareTaker.caretaker_id.forEach((y) => {
                      if (JSON.stringify(x.caretaker_id) == JSON.stringify(y)) {
                        x.isAssigned = true;
                      }
                    });
                  });
                }
              }

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

  getCareTakerOfHospitals().then(function () {});
}

function assignPatientToProgram(req, res) {
  // console.log("treq.body", req.body);
  async function assignPatientToProgram() {
    try {
      if (req.body.patient_ids && req.body) {
        let patientIds = [];
        let arrayToRemove = [];
        let popArray = [];
        let _id = mongoose.Types.ObjectId(req.body.program_id);

        req.body.patient_ids.forEach(function (n) {
          patientIds.push(mongoose.Types.ObjectId(n));
        });

        let cond = { _id: mongoose.Types.ObjectId(req.body.program_id) };

        let getProgram = await commonQuery.findoneData(programs, cond);

        lmsProgram(req, getProgram);

        if (getProgram) {
          let connectedIds = [];

          getProgram.connected_user_id.forEach(function (a) {
            connectedIds.push(mongoose.Types.ObjectId(a));
          });

          // for (var i = 0; i < connectedIds.length; i++) {
          //   for (var j = 0; j < patientIds.length; j++) {
          //     if (connectedIds[i].toString() === patientIds[j].toString()) {
          //       console.log("same", connectedIds[i]);
          //     } else {
          //       console.log("diff", connectedIds[i]);
          //       popArray.push(connectedIds[i]);
          //     }
          //   }
          // }
          // arrayToRemove.push(...new Set(popArray));
          // connectedIds.forEach(async function (a) {
          //   patientIds.forEach(async function (b) {
          //     if (a.equals(b)) {
          //     } else {
          //       popArray.push(a);
          //     }
          //   });
          // });
        }

        // console.log("popArrya", typeof popArray, arrayToRemove);

        await programs
          .findByIdAndUpdate(
            _id,
            { $set: { connected_user_id: patientIds } },
            { safe: true, upsert: true }
          )
          .exec(async (err, result) => {
            if (err) {
              console.log("ERROR", err);
              res.json(
                Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, err)
              );
            } else {
              // await programs
              //   .findByIdAndUpdate(
              //     _id,
              //     { $pull: { connected_user_id: arrayToRemove } },
              //     { safe: true, upsert: true }
              //   )
              //   .exec(async (err, resultn) => {
              //     if (err) {
              //       console.log(err);
              //     } else {
              //       console.log(resultn);
              //     }
              //   });

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

  assignPatientToProgram().then(function () {});
}

function lmsProgram(req, programInfo) {
  async function lmsProgram() {
    let unassignUser = [];
    let assignUser = [];
    let previousUser = JSON.parse(
      JSON.stringify(programInfo.connected_user_id)
    );
    let requestUser = req.body.patient_ids;
    let authorizationToken = await commonQuery.findoneData(adobeModel);
    requestUser.forEach((x) => {
      if (previousUser.indexOf(x) == -1) {
        assignUser.push(x);
      }
    });
    previousUser.forEach((x) => {
      if (requestUser.indexOf(x) == -1) {
        unassignUser.push(x);
      }
    });

    if (assignUser.length > 0) {
      for (let x of assignUser) {
        let toFindUser = { _id: mongoose.Types.ObjectId(x) };
        let lmsUser = await commonQuery.findoneData(users, toFindUser);
        if (
          lmsUser &&
          lmsUser.userLMS_id &&
          programInfo.lmsprogram_id &&
          programInfo.lmsinstance_id &&
          authorizationToken
        ) {
          let enrollmentUrl =
            urlLmsV2 +
            "/users/" +
            lmsUser.userLMS_id +
            "/enrollments" +
            "?" +
            qs.stringify({
              loId: programInfo.lmsprogram_id,
              loInstanceId: programInfo.lmsinstance_id,
            });

          request(
            {
              headers: {
                "Content-Type": "application/vnd.api+json;charset=UTF-8",
                Authorization: authorizationToken.access_token,
                Accept: "application/vnd.api+json",
              },
              uri: enrollmentUrl,
              method: "POST",
            },
            async function (error, response, body) {
              if (body) {
                let findCond = {
                  user_id: toFindUser,
                  hospital_id: mongoose.Types.ObjectId(
                    JSON.parse(JSON.stringify(programInfo.hospital_user_id))
                  ),
                };
                let updateObj = {
                  lmsprogram_enrollment_id: JSON.parse(body).data.id,
                };
                let patientUpdate = await commonQuery.updateAndUpsert(
                  patients,
                  findCond,
                  updateObj
                );
              }
              if (error) {
                console.log("Error in lmsProgram");
              }
            }
          );
        }
      }
    }

    if (unassignUser.length > 0) {
      for (let x of unassignUser) {
        let toFindUser = { _id: mongoose.Types.ObjectId(x) };
        let lmsUser = await commonQuery.findoneData(users, toFindUser);
        let findCond = {
          user_id: toFindUser,
          hospital_id: mongoose.Types.ObjectId(
            JSON.parse(JSON.stringify(programInfo.hospital_user_id))
          ),
        };
        let learninProgram = await commonQuery.findoneData(patients, findCond);
        if (
          lmsUser &&
          lmsUser.userLMS_id &&
          learninProgram.lmsprogram_enrollment_id &&
          authorizationToken
        ) {
          let enrollmentUrl =
            urlLmsV2 +
            "/users/" +
            lmsUser.userLMS_id +
            "/enrollments/" +
            learninProgram.lmsprogram_enrollment_id;

          request(
            {
              headers: {
                "Content-Type": "application/vnd.api+json;charset=UTF-8",
                Authorization: authorizationToken.access_token,
                Accept: "application/vnd.api+json",
              },
              uri: enrollmentUrl,
              method: "DELETE",
            },
            function (error, response, body) {
              if (response.statusCode == 200) {
                let findCond = {
                  user_id: toFindUser,
                  hospital_id: mongoose.Types.ObjectId(
                    JSON.parse(JSON.stringify(programInfo.hospital_user_id))
                  ),
                };
                let updateCond = {
                  lmsprogram_enrollment_id: null,
                };
                commonQuery.updateOneDocument(patients, findCond, updateCond);
              }
              if (error) {
                console.log("Error in lmsProgram");
              }
            }
          );
        }
      }
    }
  }
  lmsProgram().then((response) => {});
}

function cancelAppointmentRequest(req, res) {
  async function cancelAppointmentRequest() {
    try {
      if (req.body && req.body.appointment_request_id) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.body.appointment_request_id),
        };
        let dataToUpdate = { islive: false, isAccepted: true, isActive: false };

        let updateAppointmentRequest = await commonQuery.updateOne(
          appointmentrequests,
          condition,
          dataToUpdate
        );

        if (updateAppointmentRequest) {
          res.json(
            Response(
              constant.SUCCESS_CODE,
              constant.UPDATE_SUCCESS,
              updateAppointmentRequest
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

  cancelAppointmentRequest().then(function () {});
}

cron.schedule("* * * * * *", async function () {
  await AutoCompleteAppointment();
});

async function AutoCompleteAppointment() {
  var todaysDate = moment().utc().format("YYYY-MM-DDTHH:mm:00.000[Z]");
  // console.log("TODAY", todaysDate);

  let condition = {
    isActive: true,
    isCompleted: false,
    appointment_date: { $lt: todaysDate },
  };

  bookings.findOne(condition).exec(async function (err, result) {
    if (err) {
      console.log(err);
    } else {
      //console.log("RESULKT", result);

      if (result) {
        let condition = { _id: mongoose.Types.ObjectId(result._id) };
        let dataToUpdate = { isCompleted: true };
        let completeBookings = await commonQuery.updateOne(
          bookings,
          condition,
          dataToUpdate
        );
        if (completeBookings) {
          //  console.log("booking autocompleted");
        } else {
          // console.log("errorinautocompleted");
        }
      }
    }
  });
}

cron.schedule("* * * * * *", async function () {
  await sendPreAppointmentNotification();
});

async function sendPreAppointmentNotification() {
  var todaysDate = moment().utc().format("YYYY-MM-DDTHH:mm:00.000[Z]");
  //console.log("TODAY", todaysDate);

  let startofday = moment(todaysDate).startOf("day").format();
  let endofday = moment(todaysDate).endOf("day").format();
  //console.log(startofday, endofday);

  let condition = {
    isActive: true,
    isCompleted: false,
    appointment_date: {
      $gte: new Date(startofday),
      $lte: new Date(endofday),
    },
  };

  bookings.findOne(condition).exec(function (err, result) {
    if (err) {
      console.log("err", err);
    } else {
      // console.log("result", result)
      if (result) {
        let day = new Date(result.appointment_date).getDate();
        let month = new Date(result.appointment_date).getMonth();
        let year = new Date(result.appointment_date).getFullYear();
        let newAptTimeDate = new Date(result.appointment_time).setDate(day);
        newAptTimeDate = new Date(newAptTimeDate).setMonth(month);
        newAptTimeDate = new Date(newAptTimeDate).setFullYear(year);

        let appointmentTimeNew = moment(newAptTimeDate)
          .subtract(5, "mm")
          .format("YYYY-MM-DD[T]HH:mm[Z]");
        if (moment(todaysDate).isSame(appointmentTimeNew)) {
          let cond = { _id: mongoose.Types.ObjectId(result.patient_user_id) };
          users.findOne(cond).exec(function (err, resultdata) {
            if (err) {
            } else {
              if (resultdata.isAppointmentNotification) {
                let appointmentdate = moment(result.appointment_date).format(
                  "YYYY-MM-DD"
                );

                let appointmentTime = moment(result.appointment_time).format(
                  "HH:mm A"
                );

                var message = {
                  to: resultdata.deviceToken ? resultdata.deviceToken : "",
                  collapse_key: "your_collapse_key",
                  notification: {
                    title: "Booking Confirmation",
                    body:
                      result.patient_name +
                      "your appointment has been confirmed on" +
                      " " +
                      appointmentdate +
                      ". with " +
                      result.caretaker_name +
                      " at " +
                      appointmentTime,
                  },
                  data: {
                    my_key: "CURIO",
                    my_another_key: "NADIM",
                  },
                };
                fcm.send(message, async function (err, response) {
                  if (err) {
                    // console.log("Something has gone wrong!", err);
                  } else {
                    // console.log("Successfully sent with response: ", response);
                  }
                });
              }
            } //
          });
        }
      }
    }
  });
}

// cron.schedule("* * * * * *",)
cron.schedule("* * 23 * * *", async function () {
  sendPendingAssessmentNotification();
});

function sendPendingAssessmentNotification() {
  async function sendPendingAssessmentNotification() {
    patients
      .aggregate([
        {
          $match: {
            $and: [
              {
                assessment_id: {
                  $not: { $size: 0 },
                },
              },
              { assessment_id: { $exists: true } },
            ],
          },
        },
        {
          $project: { user_id: 1, assessment_id: 1, assessmentInfo: 1 },
        },
        {
          $unwind: "$assessment_id",
        },
        {
          $lookup: {
            from: "patientassessments",
            let: { assessment_id: "$assessment_id", user_id: "$user_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$user_id", "$$user_id"] },
                      { $eq: ["$assessment_id", "$$assessment_id"] },
                    ],
                  },
                },
              },
            ],

            as: "assessmentInfo",
          },
        },
        {
          $match: {
            $and: [{ assessmentInfo: { $size: 0 } }],
          },
        },
        {
          $lookup: {
            from: "assessmentlists",
            localField: "assessment_id",
            foreignField: "_id",
            as: "assessmentDetail",
          },
        },
      ])
      .exec(function (err, result) {
        if (err) {
        } else {
          // console.log("RESI", result);
          result.forEach(async function (a) {
            // console.log("A", a);
            let condition = {
              _id: mongoose.Types.ObjectId(a.user_id),
            };
            let findUser = await commonQuery.findoneData(users, condition);

            if (findUser.isAssessmentNotification) {
              var message = {
                to: findUser.deviceToken ? findUser.deviceToken : "",
                collapse_key: "your_collapse_key",
                notification: {
                  title: "Assessment Pending",
                  body:
                    "You have a pending assessment" +
                    " " +
                    a.assessmentDetail.name +
                    " " +
                    ".",
                },
                data: {
                  my_key: "CURIO",
                  my_another_key: "NADIM",
                },
              };
              fcm.send(message, async function (err, response) {
                if (err) {
                  // console.log("Something has gone wrong!", err);
                } else {
                  // console.log("Successfully sent with response: ", response);
                }
              });
            }
          });
        }
      });
  }

  sendPendingAssessmentNotification().then(function () {});
}

function appointRequestIdCreator(req, res) {
  async function appointRequestIdCreator() {
    if (req.body.type == "reqId") {
      appointmentrequests.save().exec(function (err, res) {
        res.json(Response(constant.SUCCESS_CODE, constant.FETCH_SUCCESS, res));
      });
    }
  }

  appointRequestIdCreator().then(function () {});
}
