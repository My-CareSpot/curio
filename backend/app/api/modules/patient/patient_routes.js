module.exports = function (router) {
  var patient = require("./controllers/patient_ctrl");
  var utils = require("../../../lib/util");
  var middlewares = [utils.ensureAuthorized];

  router.get("/get-cbt-catelog", patient.getCBTCatelog);
  router.post("/get-cbt-courses", patient.getCBTCourses);

  router.post("/add-patient", patient.addPatient);
  router.post("/assign-hobby", patient.assignHobbyToPatient);
  router.post("/send-link", patient.sendPatientRegistrationLink);
  router.post("/get-medication", patient.getMedicationHistoryData);
  router.post("/get-immunization", patient.getImmunizationHistoryOfUser);
  router.post("/get-medical", patient.getMedicalHistoryOfUser);
  router.post("/get-social", patient.getSocialHistoyOfUser);
  router.post("/get-family", patient.getFamilyHistoryOfUser);
  router.post("/delete-family", patient.deleteFamilyHistory);
  router.post("/delete-medical", patient.deleteMedicalHistory);
  router.post("/delete-medication", patient.deleteMedicationHistory);
  router.post("/delete-social", patient.deleteSocialHistoryOfUser);
  router.post("/delete-immunization", patient.deleteImmunizationHistory);
  router.post("/get-token-data", patient.checkTokenFetchData);
  router.post("/update-add-patient", patient.updateUserOnRegisteration);

  return router;
};
