import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { AllserviceService } from "src/app/allservice.service";
import { LocalService } from "src/app/local.service";
import { PatientDetailComponent } from "../dashboard/patient-detail/patient-detail.component";
@Component({
  selector: "app-add-dosage-dialog",
  templateUrl: "./add-dosage-dialog.component.html",
  styleUrls: ["./add-dosage-dialog.component.scss"],
})
export class AddDosageDialogComponent implements OnInit {
  frequency = [
    { value: "1", name: "1" },
    { value: "2", name: "2" },
    { value: "3", name: "3" },
  ];
  medTypes = [
    { name: "Syrup", value: "syrup" },
    { name: "Tablet", value: "tab" },
    { name: "Capsule", value: "cap" },
  ];

  patientId: any;
  showMorningTime: boolean;
  showAfternoonTime: boolean;
  showEveningTime: boolean;
  user_id: any;
  userData: any;
  form: FormGroup;
  description: string;
  list: any;
  startdate: any;
  enddate: any;
  datetime: any;
  queryParamsString: any;
  startDate = new Date();
  constructor(
    private fb: FormBuilder,
    private allService: AllserviceService,
    private commonServ: CommonService,
    private toastserv: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localServ: LocalService,
    private dialogRef: MatDialogRef<AddDosageDialogComponent>
  ) {
    this.form = fb.group({
      medicine_id: ["", Validators.required],
      datetime: ["", Validators.required],
      details: ["", Validators.required],
      isAfternoon: [""],
      isMorning: [""],
      isEvening: [""],
      startdate: [""],
      enddate: [""],
      medType: [""],
      morningtime: [""],
      afternoontime: [""],
      eveningtime: [""],
    });
  }

  ngOnInit() {
    // let myCompOneObj = new PatientDetailComponent();
    // myCompOneObj.myFunctionOne();

    //this.startDate.setDate(this.startDate.getDate());
    this.queryParamsString = this.activatedRoute.snapshot.params.id;

    this.form.get("isMorning").valueChanges.subscribe((data: any) => {
      this.showMorningTime = data;
    });

    this.form.get("isAfternoon").valueChanges.subscribe((data: any) => {
      this.showAfternoonTime = data;
    });

    this.form.get("isEvening").valueChanges.subscribe((data: any) => {
      this.showEveningTime = data;
    });

    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.getMedicinList();
    this.allService.getUserId().subscribe((data: any) => {
      this.patientId = data;
    });
  }
  getMedicinList() {
    let obj = {
      type: "medi",
    };
    this.commonServ.getMedicinList(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.list = data.data;
        } else if (data.code === 400) {
          this.toastserv.error(data.message, "", {
            timeOut: 1000,
          });
        }
      },
      (error) => {
        this.toastserv.error(error.error, "", {
          timeOut: 1000,
        });
      }
    );
  }
  dateChangeValue(event) {
    const date = new Date(event),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    this.datetime = [date.getFullYear(), month, day].join("-");
  }
  dateChangeValue1(event) {
    const date = new Date(event),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    this.startdate = [date.getFullYear(), month, day].join("-");
  }
  dateChangeValue2(event) {
    const date = new Date(event),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    this.enddate = [date.getFullYear(), month, day].join("-");
  }
  save() {
    this.commonServ.addDosage(this.form.value, this.patientId).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastserv.success(data.message, "", {
            timeOut: 1000,
          });
          this.dialogRef.close(this.form.value);
          this.getMedicinList();
        } else if (data.code === 400) {
          this.toastserv.error(data.message, "", {
            timeOut: 1000,
          });
        }
      },
      (error) => {
        this.toastserv.error(error.error, "", {
          timeOut: 1000,
        });
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
}
