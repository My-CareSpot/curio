import {
  Component,
  Inject,
  OnInit,
  Optional,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "app-request-dialogue",
  templateUrl: "./request-dialogue.component.html",
  styleUrls: ["./request-dialogue.component.scss"],
})
export class RequestDialogueComponent implements OnInit {
  bookingForm: FormGroup;
  requestData: any;
  startDate: any = new Date();
  careTakerList: any;
  isOtherDate: boolean;
  tempCareList: any;
  otherCareTaker: boolean;
  constructor(
    private dialogRef: MatDialogRef<RequestDialogueComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private commonServ: CommonService,
    private toastServ: ToastrService
  ) {
    this.requestData = data;
    console.log("request", this.requestData);
  }

  ngOnInit() {
    this.getCareTeamList(this.requestData.patient_user_id);
    this.bookingForm = this.fb.group({
      patient_user_id: this.requestData.patient_user_id,
      caretaker_id: this.requestData.careTeamId,
      appointment_request_id: this.requestData.requestAppointmentId,
      appointment_date: this.requestData.appointment_date,
      appointment_time: ["", Validators.required],
      appointment_end_time: ["", Validators.required],
    });
  }

  getChanged(data) {
    if (data === true) {
      this.isOtherDate = true;
      this.bookingForm.get("appointment_date");
      this.bookingForm.updateValueAndValidity();
    } else {
      this.isOtherDate = false;
    }
  }

  getCareTeamList(data) {
    let dataToPass = {
      user_id: data,
    };

    console.log("AFAA", dataToPass);

    this.commonServ.getPatientCareTeam(dataToPass).subscribe((data: any) => {
      if (data.code === 200) {
        let careTList = [];
        this.careTakerList = data.data;

        this.careTakerList.forEach((element) => {
          careTList.push({
            caretaker_id: element._id._id,
            caredata: element.user,
          });
        });
        this.tempCareList = careTList;
      } else {
        this.toastServ.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }

  dateChangeValue(data) {}

  getChangedValue(data) {
    if (data === true) {
      this.otherCareTaker = true;
      this.bookingForm.get("caretaker_id");
      this.bookingForm.updateValueAndValidity();
    } else {
      this.otherCareTaker = false;
    }
  }

  save() {
    this.commonServ.bookAppointment(this.bookingForm.value).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "Booking Success", {
            timeOut: 1000,
          });
          this.dialogRef.close(this.bookingForm.value);
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", {
            timeOut: 1000,
          });
        }
      },
      (error) => {
        this.toastServ.error(error, "", {
          timeOut: 1000,
        });
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
}
