import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuard } from "../auth.guard";
import { PatientListComponent } from "./dashboard/patient-list/patient-list.component";
import { CareTeamComponent } from "./dashboard/care-team/care-team.component";
import { CareregisterComponent } from "./dashboard/careregister/careregister.component";
import { AvailabilityComponent } from "./dashboard/availability/availability.component";
import { RegisterpatientComponent } from "./dashboard/registerpatient/registerpatient.component";
import { AppointementrequestComponent } from "./dashboard/appointementrequest/appointementrequest.component";
import { ConsultComponent } from "./dashboard/consult/consult.component";
import { ProfileComponent } from "./dashboard/profile/profile.component";
import { PatientDetailComponent } from "./dashboard/patient-detail/patient-detail.component";
import { SetAvailabilityComponent } from "./dashboard/calendar-settings/set-availability/set-availability.component";
import { CalendarComponent } from "./dashboard/calendar-settings";
import { AppointmentlistComponent } from "./appointmentlist/appointmentlist.component";
import { ThankyoupageComponent } from "./dashboard/thankyoupage/thankyoupage.component";
import { AssessmentListComponent } from "./assessment-list/assessment-list.component";
import { AssessmentQaListComponent } from "./assessment-qa-list/assessment-add.component";
import { QuestionAddComponent } from "./question-add/question-add.component";
import { ProgramManagementComponent } from "./program-management/program-management.component";
import { SendmotivationComponent } from "./dashboard/sendmotivation/sendmotivation.component";
import { SendgroupactivityComponent } from "./dashboard/sendgroupactivity/sendgroupactivity.component";
import { QuestionEditComponent } from "./question-edit/question-edit.component";
import { SettingComponent } from "./dashboard/setting/setting.component";
import { AssessmentPatientComponent } from "./assessment-patient/assessment-patient.component";
import { ChatComponent } from "./chat/chat.component";
import { AssessmentpatientListComponent } from "./assessmentpatient-list/assessmentpatient-list.component";
import { AssessmentpatientQuestionComponent } from "./assessmentpatient-question/assessmentpatient-question.component";
import { PatientRegisterFormComponent } from "./dashboard/patient-register-form/patient-register-form.component";
import { VideocallnotificationComponent } from "./dashboard/videocallnotification/videocallnotification.component";
import { JournalListComponent } from "./journal-list/journal-list.component";
import { JournalPatientComponent } from "./journal-patient/journal-patient.component";
import { JournalQaListComponent } from "./journal-qa-list/journal-qa-list.component";
import { JournalQuestionAddComponent } from "./journal-question-add/journal-question-add.component";
import { JournalQuestionEditComponent } from "./journal-question-edit/journal-question-edit.component";
import { JournalpatientListComponent } from "./journalpatient-list/journalpatient-list.component";
import { JournalpatientQuestionComponent } from "./journalpatient-question/journalpatient-question.component";
import { GroupsessionComponent } from "./dashboard/groupsession/groupsession.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "patient-list", component: PatientListComponent },
      { path: "care-team", component: CareTeamComponent },
      { path: "group-session", component: GroupsessionComponent },
      { path: "care-member-registation", component: CareregisterComponent },
      { path: "video-notification", component: VideocallnotificationComponent },

      { path: "program-management", component: ProgramManagementComponent },
      { path: "consult", component: ConsultComponent },
      { path: "profile", component: ProfileComponent },
      { path: "patient-detail/:id", component: PatientDetailComponent },
      { path: "setting", component: SettingComponent },

      //{ path: "set-availibility", component: AvailabilityComponent },
      {
        path: "calendar",
        component: CalendarComponent,
      },
      { path: "send-motivation", component: SendmotivationComponent },
      { path: "send-group-activity", component: SendgroupactivityComponent },
      { path: "set-availibility", component: SetAvailabilityComponent },
      {
        path: "appointment-request",
        component: AppointementrequestComponent,
      },
      { path: "add-patient", component: PatientRegisterFormComponent },
      { path: "booking-list", component: AppointmentlistComponent },
      { path: "", redirectTo: "appointment-request", pathMatch: "full" },
      { path: "assessment-list", component: AssessmentListComponent },

      { path: "journal-list", component: JournalListComponent },
      { path: "journal-patient", component: JournalPatientComponent },
      { path: "get-journalQuestionInfo", component: JournalQaListComponent },
      { path: "add-journal-question", component: JournalQuestionAddComponent },
      {
        path: "edit-journal-question",
        component: JournalQuestionEditComponent,
      },
      {
        path: "patient-journal-list/:id",
        component: JournalpatientListComponent,
      },
      {
        path: "patient-journal-question/:id",
        component: JournalpatientQuestionComponent,
      },

      { path: "get-userQuestionInfo", component: AssessmentQaListComponent },
      { path: "add-assessment-question", component: QuestionAddComponent },
      { path: "edit-assessment-question", component: QuestionEditComponent },
      { path: "assessment-patient", component: AssessmentPatientComponent },
      { path: "chat", component: ChatComponent },
      {
        path: "patient-assessment-list/:id",
        component: AssessmentpatientListComponent,
      },
      {
        path: "patient-assessment-question/:id",
        component: AssessmentpatientQuestionComponent,
      },
    ],
  },
  {
    path: "patient-registration/:id",
    component: RegisterpatientComponent,
  },
  {
    path: "thank-you",
    component: ThankyoupageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostpitalRoutingModule {}
