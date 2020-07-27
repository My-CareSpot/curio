import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

let httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("LoggedInUser"),
  }),
};

console.log(httpOptions);

@Injectable({
  providedIn: "root",
})
export class CommonService {
  // accessToken = localStorage.getItem("LoggedInUser");

  baseURL = environment.apiURL;
  constructor(private http: HttpClient) {}

  surveyListItemSubject = new BehaviorSubject<any>(null);
  surveyListItemObserver = this.surveyListItemSubject.asObservable();

  private appointmentData = new BehaviorSubject<Object>({});

  getAssignedJournalQuestionList(data) {
    return this.http.post(
      this.baseURL + "/get-assigned-journal-question",
      data,
      httpOptions
    );
  }

  getAssignedJournalList(data) {
    return this.http.post(
      this.baseURL + "/get-assigned-journal",
      data,
      httpOptions
    );
  }

  savePatientJournal(data) {
    return this.http.post(
      this.baseURL + "/save-hospitalJournal",
      data,
      httpOptions
    );
  }

  showjournal(data) {
    return this.http.post(
      this.baseURL + "/show-hospitalJournal",
      data,
      httpOptions
    );
  }

  SaveJournalQuestion(data) {
    return this.http.post(
      this.baseURL + "/add-journal-question",
      data,
      httpOptions
    );
  }

  getJournalQuestionList(data) {
    return this.http.post(
      this.baseURL + "/get-userJournalQuestionList",
      data,
      httpOptions
    );
  }

  getJournalList(data) {
    return this.http.post(this.baseURL + "/get-allJournal", data, httpOptions);
  }

  saveJournal(data) {
    return this.http.post(this.baseURL + "/add-journal", data, httpOptions);
  }
  deletejournal(data) {
    return this.http.post(this.baseURL + "/delete-journal", data, httpOptions);
  }

  getAssignedQuestionList(data) {
    return this.http.post(
      this.baseURL + "/get-assigned-question",
      data,
      httpOptions
    );
  }

  getAssignedAssessmentList(data) {
    return this.http.post(
      this.baseURL + "/get-assigned-assessment",
      data,
      httpOptions
    );
  }

  // getMotivationList(data) {
  //   return this.http.post(
  //     this.baseURL + "/get-motivationList",
  //     data,
  //     httpOptions
  //   );
  // }

  setAppointmentData(data: Object) {
    this.appointmentData.next(data);
  }
  getAppointmentData(): Observable<Object> {
    return this.appointmentData.asObservable();
  }

  addMedicalHistory(data) {
    return this.http.post(this.baseURL + "/add-medical-history", data);
  }
  addImmunizationHistory(data) {
    return this.http.post(this.baseURL + "/add-immunization-history", data);
  }
  addManyImmunizationHistory(data) {
    return this.http.post(
      this.baseURL + "/add-many-immunization-history",
      data
    );
  }
  addSocialHistory(data) {
    return this.http.post(this.baseURL + "/add-social-history", data);
  }
  addMedicationHistory(data) {
    return this.http.post(this.baseURL + "/add-medication-history", data);
  }
  addFamilyHistory(data) {
    return this.http.post(this.baseURL + "/add-family-history", data);
  }
  addManyFamilyHistory(data) {
    return this.http.post(this.baseURL + "/add-many-family-history", data);
  }

  updateMedicalHistory(data) {
    return this.http.post(this.baseURL + "/update-medical-history", data);
  }
  updateImmunizationHistory(data) {
    return this.http.post(this.baseURL + "/update-immunization-history", data);
  }
  updateSocialHistory(data) {
    return this.http.post(this.baseURL + "/update-social-history", data);
  }
  updateMedicationHistory(data) {
    return this.http.post(this.baseURL + "/update-medication-history", data);
  }
  updateFamilyHistory(data) {
    return this.http.post(this.baseURL + "/update-family-history", data);
  }

  generateToken(data) {
    return this.http.post(this.baseURL + "/get-video-token", data, httpOptions);
  }

  savePatientAssignment(data) {
    return this.http.post(
      this.baseURL + "/save-hospitalAssessment",
      data,
      httpOptions
    );
  }

  getSocialHistory(data) {
    return this.http.post(this.baseURL + "/get-social", data, httpOptions);
  }
  getFamilyHistory(data) {
    return this.http.post(this.baseURL + "/get-family", data, httpOptions);
  }
  getMedical(data) {
    return this.http.post(this.baseURL + "/get-medical", data, httpOptions);
  }
  getMedication(data) {
    return this.http.post(this.baseURL + "/get-medication", data, httpOptions);
  }
  getImmunization(data) {
    return this.http.post(
      this.baseURL + "/get-immunization",
      data,
      httpOptions
    );
  }

  deleteSocialHistory(data) {
    return this.http.post(this.baseURL + "/delete-social", data, httpOptions);
  }
  patientDeclinedCall(data) {
    return this.http.post(
      this.baseURL + "/decline-video-call-patient",
      data,
      httpOptions
    );
  }
  doctorDeclinedCall(data) {
    return this.http.post(
      this.baseURL + "/decline-video-call-doctor",
      data,
      httpOptions
    );
  }
  deleteFamily(data) {
    return this.http.post(this.baseURL + "/delete-family", data, httpOptions);
  }
  deleteMedical(data) {
    return this.http.post(this.baseURL + "/delete-medical", data, httpOptions);
  }

  addGroupSession(data) {
    return this.http.post(
      this.baseURL + "/add-group-session",
      data,
      httpOptions
    );
  }

  deleteMedication(data) {
    return this.http.post(
      this.baseURL + "/delete-medication",
      data,
      httpOptions
    );
  }
  deleteImmunization(data) {
    return this.http.post(
      this.baseURL + "/delete-immunization",
      data,
      httpOptions
    );
  }

  showAssessment(data) {
    return this.http.post(
      this.baseURL + "/show-hospitalAssessment",
      data,
      httpOptions
    );
  }

  SaveMySurvey(data) {
    return this.http.post(
      this.baseURL + "/add-assessment-question",
      data,
      httpOptions
    );
  }
  getQuestionList(data) {
    return this.http.post(
      this.baseURL + "/get-userQuestionInfo",
      data,
      httpOptions
    );
  }
  getAssessmentList(data) {
    return this.http.post(
      this.baseURL + "/get-allAssessment",
      data,
      httpOptions
    );
  }
  saveAssignment(data) {
    return this.http.post(this.baseURL + "/add-assessment", data, httpOptions);
  }
  deleteAssessment(data) {
    return this.http.post(
      this.baseURL + "/delete-assessment",
      data,
      httpOptions
    );
  }

  login(data) {
    return this.http.post(this.baseURL + "/login", data);
  }
  register(data) {
    return this.http.post(this.baseURL + "/register", data);
  }
  getMissCallNotification(data) {
    return this.http.post(this.baseURL + "/get-miss-call-notification", data);
  }
  addPatientbyEmail(data, user_id) {
    data.user_id = user_id;
    return this.http.post(this.baseURL + "/send-link", data);
  }
  addDosage(data, user_id) {
    data.user_id = user_id;
    return this.http.post(this.baseURL + "/add-dosage", data, httpOptions);
  }
  updateCaretaker(data, user_id) {
    data.user_id = user_id;
    return this.http.post(
      this.baseURL + "/edit-care-detail",
      data,
      httpOptions
    );
  }
  deleteCaretaker(data) {
    return this.http.post(
      this.baseURL + "/delete-care-member",
      data,
      httpOptions
    );
  }

  deletepatient(data) {
    return this.http.post(this.baseURL + "/delete-user", data, httpOptions);
  }
  markAsRead(data) {
    return this.http.post(this.baseURL + "/mark-as-read", data, httpOptions);
  }

  ///send-call-notification

  sendCallNotificationToPatient(data) {
    return this.http.post(
      this.baseURL + "/send-call-notification",
      data,
      httpOptions
    );
  }

  imageUpload(data) {
    console.log("DATA", data);
    return this.http.post(this.baseURL + "/image-upload", data);
  }

  attachmentUpload(data) {
    return this.http.post(this.baseURL + "/attachment-upload", data);
  }

  uploadImg(data) {
    return this.http.post(this.baseURL + "/uploadImg", data);
  }

  getVideoCallNotification(data) {
    return this.http.post(
      this.baseURL + "/get-video-call-notification",
      data,
      httpOptions
    );
  }

  changePasswordData(data) {
    return this.http.post(this.baseURL + "/change-password", data, httpOptions);
  }
  updatePatient(data, user_id) {
    data.user_id = user_id;
    return this.http.post(this.baseURL + "/edit-user", data, httpOptions);
  }
  getMedicinList(data) {
    return this.http.post(this.baseURL + "/get-medicines", data, httpOptions);
  }
  getspecialization(data) {
    return this.http.post(
      this.baseURL + "/get-specialization",
      data,
      httpOptions
    );
  }

  getCareMemberBookin(data) {
    return this.http.post(
      this.baseURL + "/get-care-member-appointment",
      data,
      httpOptions
    );
  }

  address(data, user_id) {
    data.user_id = user_id;
    return this.http.post(this.baseURL + "/add-address", data);
  }

  getHospitalCareTaker(data) {
    return this.http.post(this.baseURL + "/get-hospital-caretaker", data);
  }
  assignPatientProgram(data) {
    return this.http.post(
      this.baseURL + "/assign-patient-program",
      data,
      httpOptions
    );
  }

  assignJournalProgram(data) {
    return this.http.post(
      this.baseURL + "/assign-journal-program",
      data,
      httpOptions
    );
  }

  getMotivationList(data) {
    return this.http.post(
      this.baseURL + "/get-motivationList",
      data,
      httpOptions
    );
  }

  getProfileDetails(data) {
    return this.http.post(this.baseURL + "/get-user-detail", data, httpOptions);
  }

  updateProfileDetails(data) {
    return this.http.post(this.baseURL + "/edit-user", data, httpOptions);
  }

  caretaker(data) {
    return this.http.post(this.baseURL + "/add-caretaker", data, httpOptions);
  }
  addHospital(data) {
    return this.http.post(this.baseURL + "/add-hospital", data, httpOptions);
  }
  addPatient(data) {
    return this.http.post(this.baseURL + "/add-patient", data, httpOptions);
  }
  addHobby(data) {
    return this.http.post(this.baseURL + "/add-hobby", data, httpOptions);
  }
  getHobbies(data) {
    return this.http.post(this.baseURL + "/get-hobbies", data, httpOptions);
  }

  sendMotivations(data) {
    return this.http.post(this.baseURL + "/send-motivation", data, httpOptions);
  }

  assginHobby(data) {
    return this.http.post(this.baseURL + "/assign-hobby", data, httpOptions);
  }

  getPatientCareTeam(data) {
    return this.http.post(
      this.baseURL + "/get-patient-careteam",
      data,
      httpOptions
    );
  }

  getProgram(data) {
    return this.http.post(this.baseURL + "/get-programs", data, httpOptions);
  }
  updateProgram(data) {
    return this.http.post(this.baseURL + "/update-program", data, httpOptions);
  }
  deleteProgram(data) {
    return this.http.post(this.baseURL + "/delete-program", data);
  }

  addProgram(data) {
    return this.http.post(this.baseURL + "/add-program", data);
  }

  sendRegisterlink(data) {
    return this.http.post(this.baseURL + "/send-link", data);
  }

  updateSpecialistAvailability(data: any) {
    return this.http.post(this.baseURL + "/set-availability", data);
  }

  addSpecialistAvailability(data: any) {
    return this.http.post(this.baseURL + "/add-availability", data);
  }
  getCareTakerAvailibility(data: any) {
    return this.http.post(this.baseURL + "/care-taker-availability", data);
  }
  getCareTakerAvailibilities(data: any) {
    return this.http.post(this.baseURL + "/care-taker-avail", data);
  }

  getSpecialistAvailability(data: any) {
    return this.http.post(
      this.baseURL + "/get-availability",
      data,
      httpOptions
    );
  }

  getPatientList(data) {
    return this.http.post(this.baseURL + "/get-patients", data, httpOptions);
  }
  
  getSearchedPatientList(data) {
    return this.http.post(
      this.baseURL + "/get-searched-patients",
      data,
      httpOptions
    );
  }
  chatConnection() {
    return this.http.get(
      this.baseURL + "/chat-connection",
      httpOptions
    );
  }
  getAppointmentList(data) {
    return this.http.post(
      this.baseURL + "/get-care-member-appointments",
      data,
      httpOptions
    );
  }
  bookAppointment(data) {
    return this.http.post(this.baseURL + "/book-appointment", data);
  }

  checkToken(data) {
    return this.http.post(this.baseURL + "/get-token-data", data);
  }
  updateAddPatientData(data) {
    return this.http.post(this.baseURL + "/update-add-patient", data);
  }

  //

  getAppReqList(data) {
    return this.http.post(
      this.baseURL + "/get-appointnment-request",
      data,
      httpOptions
    );
  }

  createRequestId(data) {
    return this.http.post(
      this.baseURL + "/create-request-id",
      data,
      httpOptions
    );
  }

  getCareAppointment(data) {
    return this.http.post(
      this.baseURL + "/get-care-appointment",
      data,
      httpOptions
    );
  }

  notificationSetting(data) {
    return this.http.post(
      this.baseURL + "/notification-setting",
      data,
      httpOptions
    );
  }

  getCaretakerList(data) {
    return this.http.post(this.baseURL + "/get-caretaker", data, httpOptions);
  }
  viewCaretakerList(data) {
    return this.http.post(
      this.baseURL + "/get-patient-careteam",
      data,
      httpOptions
    );
  }
  getDosageList(data) {
    return this.http.post(this.baseURL + "/get-dosage", data, httpOptions);
  }

  readNotify(data) {
    return this.http.post(
      this.baseURL + "/read-notification",
      data,
      httpOptions
    );
  }

  getPatientInfo(data) {
    return this.http.post(
      this.baseURL + "/get-patient-detail",
      data,
      httpOptions
    );
  }
  assignCaretaker(data) {
    return this.http.post(
      this.baseURL + "/assign-caretaker",
      data,
      httpOptions
    );
  }
  unassignCaretaker(data) {
    return this.http.post(this.baseURL + "/unassign-caretaker", data);
  }

  getNotifications(data) {
    return this.http.post(
      this.baseURL + "/get-notification",
      data,
      httpOptions
    );
  }

  getSymptom(data) {
    return this.http.post(this.baseURL + "/get-symptom", data, httpOptions);
  }
  getSideEffect(data) {
    return this.http.post(this.baseURL + "/get-sideeffect", data, httpOptions);
  }
  updateSymptom(data) {
    return this.http.post(this.baseURL + "/update-symptom", data, httpOptions);
  }
  updateSideEffect(data) {
    return this.http.post(
      this.baseURL + "/update-sideeffect",
      data,
      httpOptions
    );
  }
  deleteSymptom(data) {
    return this.http.post(this.baseURL + "/delete-symptom", data);
  }
  deleteSideEffect(data) {
    return this.http.post(this.baseURL + "/delete-sideeffect", data);
  }
  addSymptom(data) {
    return this.http.post(this.baseURL + "/add-symptom", data);
  }
  addSideEffect(data) {
    return this.http.post(this.baseURL + "/add-sideeffect", data);
  }
  setHospitalTiming(data) {
    return this.http.post(
      this.baseURL + "/hospital-setting",
      data,
      httpOptions
    );
  }
}
