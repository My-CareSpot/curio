module.exports = function (router) {
  var hospital = require("./controllers/hospital_ctrl");
  var chat = require("../../../lib/chat");
  var utils = require("../../../lib/util");
  var middlewares = [utils.ensureAuthorized];  

  router.post("/get-playlist-point", hospital.getPlaylistPoint);
  router.post("/get-all-chat", chat.getAllMessage);
  router.post("/add-hospital", hospital.saveHospital);
  router.post("/add-hobby", hospital.addHobbies);
  router.post("/get-hobbies", middlewares, hospital.getHobbies);
  router.post("/add-medicine", hospital.addMedicines);
  router.post("/add-dosage", hospital.addDosage);
  router.post("/get-dosage", middlewares, hospital.getDosages);
  router.post("/get-patients", hospital.getPatients);
  router.post("/get-searched-patients", hospital.getPatientSearch);
  // router.get("/chat-connection", chat.socketMethod);
  

  router.post("/add-specialization", hospital.addSepcialization);
  router.post("/get-specialization", hospital.getSpecialization);
  router.post("/add-caretaker", hospital.addCareTaker);
  router.post("/get-caretaker", middlewares, hospital.getCareTaker);
  router.post("/assign-caretaker", hospital.assignCareTaker);

  router.post("/get-hospital-caretaker", hospital.getCareTakerOfHospitals);
  router.post("/assign-patient-program", hospital.assignPatientToProgram);
  router.post("/assign-journal-program", hospital.assignJournalToProgram);
  router.post("/uploadImg", hospital.uploadImg);
  router.post("/get-journal-list", hospital.getJournalLists);


  // router.post("/unassign-caretaker", hospital.assignCareTaker);
  router.post(
    "/get-patient-careteam",
    middlewares,
    hospital.getCareTeamOfPatient
  );
  router.post(
    "/request-appointnment",
    middlewares,
    hospital.requestAppointment
  );
  router.post(
    "/get-appointnment-request",
    middlewares,
    hospital.getAppointmentRequest
  );
  router.post("/get-notification", hospital.getNotification);
  router.post("/read-notification", hospital.readNotification);
  router.post(
    "/get-care-member-appointments",
    hospital.getIndividualCareTakerAppointments
  );
  router.post(
    "/get-symptom-list",
    middlewares,
    hospital.getSymptpmsAndSideEffects
  );

  router.post("/send-response", middlewares, hospital.respondOfSymptoms);

  router.post("/select-hobby", middlewares, hospital.selectHobbies);

  router.post(
    "/get-patient-reminders",
    middlewares,
    hospital.getMedicationReminders
  );

  router.post("/edit-care-detail", hospital.editCareTakerDetail);
  router.post("/delete-care-member", hospital.deleteCareTaker);

  router.post("/add-program", hospital.addProgram);

  router.post("/add-symptom", hospital.addSymptoms);

  router.post("/get-programs", hospital.getPrograms);
  router.post("/update-program", hospital.updateProgram);
  router.post("/delete-program", hospital.deleteProgram);

  router.post("/add-sideeffect", hospital.addSideEffect);
  router.post("/send-motivation", hospital.sendMotivations);

  router.post("/hospital-setting", hospital.hospitalTimingSettings);

  router.post("/get-hospital-timing", middlewares, hospital.getHospitalTiming);

  router.post("/update-hospital-timing", hospital.updateTimingSetting);

  router.post(
    "/get-program-analysis",
    middlewares,
    hospital.getMonthlySymptomSideEffectAnalysis
  );

  router.post("/set-availability", hospital.setAvailability);
  router.post("/add-availability", hospital.addAvailability);
  router.post("/care-taker-availability", hospital.getCareTakerAvailibility);
  router.post("/care-taker-avail", hospital.getCareTakerAvailibilities);
  router.post("/get-availability", hospital.getAvailability);
  router.post("/book-appointment", hospital.bookAppointment);
  router.post(
    "/get-care-appointment",
    middlewares,
    hospital.getCareTakerAppointments
  );

  router.post(
    "/create-request-id",
    middlewares,
    hospital.appointRequestIdCreator
  );

  router.post(
    "/get-care-completed-appointment",
    middlewares,
    hospital.getCareTakerCompletedAppointments
  );
  router.post("/get-patient-detail", middlewares, hospital.getPatientDetails);

  router.post("/get-appointment", middlewares, hospital.getPatientAppointments);

  router.post(
    "/get-patient-pending-request",
    middlewares,
    hospital.patientPendingRequest
  );

  router.post(
    "/get-patient-accepted-request",
    middlewares,
    hospital.patientAcceptedRequest
  );

  router.post("/get-medicines", hospital.getMedicine);
  router.post(
    "/get-completed-appointment",
    middlewares,
    hospital.getCompletedPatientAppointments
  );

  router.post("/add-journal", hospital.saveJournalList);
  router.post("/get-allJournal", hospital.getAllJournal);
  router.post("/add-journal-question", hospital.addJournalQues);
  router.post(
    "/get-userJournalQuestionList",
    hospital.getUserJournalQuestionList
  );
  router.post("/delete-journal", hospital.deleteJournal);
  router.post("/show-hospitalJournal", hospital.showHospitalJournal);
  router.post("/save-hospitalJournal", hospital.saveHospitalJournal);
  router.post("/get-assigned-journal", hospital.getAssignedJournal);
  router.post(
    "/get-allJournalMobile",
    // middlewares,
    hospital.getAllJournalMobile
  );
  router.post("/save-patientJournal", hospital.savePatientJournal);
  router.post("/get-journalQuestion", hospital.getJournalQuestion);
  router.post(
    "/get-assigned-journal-question",
    hospital.getAssignedJournalQuestion
  );

  router.post("/get-playlist", hospital.playList);
  router.post("/get-activitylist", hospital.activitylist);
  router.post("/add-assessment-question", hospital.addAssessmentQues);
  router.post("/add-assessment", hospital.saveQuestionList);
  router.post("/get-userQuestionInfo", hospital.getUserQuestionInfo);
  router.post("/get-allAssessment", middlewares, hospital.getAllAssessment);
  router.post("/delete-assessment", hospital.deleteAssessment);
  router.post(
    "/get-allAssessmentMobile",
    middlewares,
    hospital.getAllAssessmentMobile
  );
  router.post("/get-assessmentQuestion", hospital.getAssessmentQuestion);
  router.post("/save-patientAssessment", hospital.savePatientAssessment);
  router.post("/save-hospitalAssessment", hospital.saveHospitalAssessment);
  router.post("/show-hospitalAssessment", hospital.showHospitalAssessment);

  router.post("/get-symptom", hospital.getSymptom);
  router.post("/get-sideeffect", hospital.getSideEffect);
  router.post("/update-symptom", hospital.updateSymptom);
  router.post("/update-sideeffect", hospital.updateSideEffect);
  router.post("/delete-symptom", hospital.deleteSymptom);
  router.post("/delete-sideeffect", hospital.deleteSideEffect);
  router.post("/get-motivationList", hospital.getMotivationList);

  router.post("/cancel-appointment-request", hospital.cancelAppointmentRequest);
  router.post("/get-assigned-assessment", hospital.getAssignedAssessment);
  router.post("/get-assigned-question", hospital.getAssignedQuestion);

  router.post(
    "/get-video-call-notification",
    hospital.getVideoCallNotifications
  );

  router.post("/mark-as-read", hospital.markVideoNotificationAsRead);

  return router;
};
