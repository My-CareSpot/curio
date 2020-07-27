import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { HostpitalRoutingModule } from "./hostpital-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { MaincontentComponent } from "./maincontent/maincontent.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { PatientListComponent } from "./dashboard/patient-list/patient-list.component";
import { CareTeamComponent } from "./dashboard/care-team/care-team.component";
import { CareregisterComponent } from "./dashboard/careregister/careregister.component";

import {
  MatStepperModule,
  MatInputModule,
  MatButtonModule,
  MatSlideToggleModule,
} from "@angular/material";
import { MatDialogModule } from "@angular/material/dialog";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material";
import { MatSelectModule } from "@angular/material/select";
import { MaterialModule } from "../material.module";
import { AppointementrequestComponent } from "./dashboard/appointementrequest/appointementrequest.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import {
  CalendarComponent,
  UnavailabilityDialog,
} from "./dashboard/calendar-settings/calendar/calendar.component";
import { SetAvailabilityComponent } from "./dashboard/calendar-settings/set-availability/set-availability.component";

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { AvailabilityComponent } from "./dashboard/availability/availability.component";

import { ProfileComponent } from "./dashboard/profile/profile.component";
import { ConsultComponent } from "./dashboard/consult/consult.component";
import { PatientDetailComponent } from "./dashboard/patient-detail/patient-detail.component";

import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RegisterpatientComponent } from "./dashboard/registerpatient/registerpatient.component";
import { DialogComponent } from "./dialog/dialog.component";
import { AssignpatientdialogComponent } from "./assignpatientdialog/assignpatientdialog.component";
import { RequestDialogueComponent } from "./dashboard/appointementrequest/request-dialogue/request-dialogue.component";
import { AddDosageDialogComponent } from "./add-dosage-dialog/add-dosage-dialog.component";
import { AddRecordDialogComponent } from "./add-record-dialog/add-record-dialog.component";
import { EditCaretakerdialogComponent } from "./edit-caretakerdialog/edit-caretakerdialog.component";
import { EditpatientdialogComponent } from "./editpatientdialog/editpatientdialog.component";
import { AppointmentlistComponent } from "./appointmentlist/appointmentlist.component";
import { AssignedCaretakerComponent } from "./assigned-caretaker/assigned-caretaker.component";
import { ThankyoupageComponent } from "./dashboard/thankyoupage/thankyoupage.component";
import { AssessmentListComponent } from "./assessment-list/assessment-list.component";
import { AssessmentQaListComponent } from "./assessment-qa-list/assessment-add.component";
import { QuestionAddComponent } from "./question-add/question-add.component";
import { ProgramManagementComponent } from "./program-management/program-management.component";
import { SendmotivationComponent } from "./dashboard/sendmotivation/sendmotivation.component";
import { SendgroupactivityComponent } from "./dashboard/sendgroupactivity/sendgroupactivity.component";
import { AssignmentadddialogComponent } from "./assignmentadddialog/assignmentadddialog.component";
import { QuestionEditComponent } from "./question-edit/question-edit.component";
import { SettingComponent } from "./dashboard/setting/setting.component";
import { AssessmentPatientComponent } from "./assessment-patient/assessment-patient.component";
import { EditPatientassessmentDialogComponent } from "./edit-patientassessment-dialog/edit-patientassessment-dialog.component";
import { ChatComponent } from "./chat/chat.component";
import { AssessmentpatientListComponent } from "./assessmentpatient-list/assessmentpatient-list.component";
import { AssessmentpatientQuestionComponent } from "./assessmentpatient-question/assessmentpatient-question.component";
import { PatientRegisterFormComponent } from "./dashboard/patient-register-form/patient-register-form.component";
import { VideocallnotificationComponent } from "./dashboard/videocallnotification/videocallnotification.component";
import { JournalListComponent } from './journal-list/journal-list.component';
import { JournaladddialogComponent } from './journaladddialog/journaladddialog.component';
import { JournalPatientComponent } from './journal-patient/journal-patient.component';
import { JournalQaListComponent } from './journal-qa-list/journal-qa-list.component';
import { JournalQuestionAddComponent } from './journal-question-add/journal-question-add.component';
import { JournalQuestionEditComponent } from './journal-question-edit/journal-question-edit.component';
import { EditPatientjournalDialogComponent } from './edit-patientjournal-dialog/edit-patientjournal-dialog.component';
import { JournalpatientListComponent } from './journalpatient-list/journalpatient-list.component';
import { JournalpatientQuestionComponent } from './journalpatient-question/journalpatient-question.component';
import { GroupsessionComponent } from './dashboard/groupsession/groupsession.component';

@NgModule({
  declarations: [
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    MaincontentComponent,
    SidebarComponent,
    PatientListComponent,
    CareTeamComponent,
    CareregisterComponent,
    DialogComponent,
    AssignpatientdialogComponent,
    AvailabilityComponent,
    RegisterpatientComponent,
    AppointementrequestComponent,
    ProfileComponent,
    ConsultComponent,
    PatientDetailComponent,
    CalendarComponent,
    SetAvailabilityComponent,
    AppointementrequestComponent,
    ConsultComponent,
    PatientDetailComponent,
    ProfileComponent,
    RequestDialogueComponent,
    AddDosageDialogComponent,
    UnavailabilityDialog,
    AddRecordDialogComponent,
    EditCaretakerdialogComponent,
    EditpatientdialogComponent,
    AppointmentlistComponent,
    AssignedCaretakerComponent,
    ThankyoupageComponent,
    AssessmentListComponent,
    AssessmentQaListComponent,
    QuestionAddComponent,
    ProgramManagementComponent,
    SendmotivationComponent,
    SendgroupactivityComponent,
    AssignmentadddialogComponent,
    QuestionEditComponent,
    SettingComponent,
    AssessmentPatientComponent,
    EditPatientassessmentDialogComponent,
    ChatComponent,
    AssessmentpatientListComponent,
    AssessmentpatientQuestionComponent,
    PatientRegisterFormComponent,
    VideocallnotificationComponent,
    JournalListComponent,
    JournaladddialogComponent,
    JournalPatientComponent,
    JournalQaListComponent,
    JournalQuestionAddComponent,
    JournalQuestionEditComponent,
    EditPatientjournalDialogComponent,
    JournalpatientListComponent,
    JournalpatientQuestionComponent,
    GroupsessionComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MatSelectModule,
    MaterialModule,
    HostpitalRoutingModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [
    DialogComponent,
    AssignpatientdialogComponent,
    EditCaretakerdialogComponent,
    EditpatientdialogComponent,
    RequestDialogueComponent,
    AddDosageDialogComponent,
    UnavailabilityDialog,
    AddRecordDialogComponent,
    AssignedCaretakerComponent,
    AssignmentadddialogComponent,
    EditPatientassessmentDialogComponent,
    JournaladddialogComponent,
    EditPatientjournalDialogComponent
  ],
})
export class HostpitalModule {}
