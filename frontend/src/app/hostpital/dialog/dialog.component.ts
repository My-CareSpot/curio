import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { countries } from "../../country";
@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent implements OnInit {
  user_id: any;
  hospital_id: any;
  userData: any;
  form: FormGroup;
  description: string;
  countriesList: any = countries;
  patientUserId: any;

  constructor(
    private fb: FormBuilder,
    private commonServ: CommonService,
    private toastserv: ToastrService,
    private router: Router,
    private localServ: LocalService,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.hospital_id = this.user_id;
    this.form = this.fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      phoneNumber: [""],
      country: [""],
      countryCode: [""],
    });
    this.form.get("country").valueChanges.subscribe((data: any) => {
      //console.log("JJ", data);
      this.form.get("countryCode").setValue(data);
      this.form.get("countryCode").updateValueAndValidity();
    });
  }

  save() {
    this.commonServ.addPatientbyEmail(this.form.value, this.user_id).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.patientUserId = data.data;
          this.addPatient();
          this.toastserv.success("Email Sent Successfully", "", {
            timeOut: 1000,
          });
          this.dialogRef.close(this.form.value);
        } else if (data.code === 201) {
          this.toastserv.warning(data.message, "", {
            timeOut: 1000,
          });
        } else if (data.code === 400) {
          this.toastserv.success("Sent ", "", {
            timeOut: 1000,
          });
          this.dialogRef.close(this.form.value);
        }
      },
      (error) => {
        this.toastserv.error(error.error, "", {
          timeOut: 1000,
        });
      }
    );
  }

  addPatient() {
    let object = {
      user_id: this.patientUserId._id,
      hospital_id: this.hospital_id,
    };
    console.log("OBJECT", object);
    this.commonServ.addPatient(object).subscribe(
      (data: any) => {
        console.log("ADA", data);
        if (data.code === 200) {
          // this.toastserv.success(data.message, "", {
          //   timeOut: 1000
          // });
          //this.adressInfo();
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
