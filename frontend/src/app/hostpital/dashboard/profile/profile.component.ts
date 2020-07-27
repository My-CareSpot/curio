import { Component, OnInit } from "@angular/core";
import { LocalService } from "src/app/local.service";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  userData: any;
  user_id: any;
  userDetails: any;
  isEdit: any;
  saveHospitalForm: FormGroup;
  constructor(
    private localServ: LocalService,
    private commonServ: CommonService,
    private toastServ: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    console.log("data", this.userData);
    this.user_id = this.userData._id;
    console.log("userid", this.user_id);
    this.saveHospitalForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: ["", Validators.required],
    });
    this.getProfDetails();

    //this.saveHospitalForm.get("firstName").setValue(this.userData.firstName);
  }

  openEdit() {
    this.isEdit = true;
    this.saveHospitalForm.get("firstName").setValue(this.userDetails.firstName);
    this.saveHospitalForm.get("lastName").setValue(this.userDetails.lastName);
    this.saveHospitalForm.get("email").setValue(this.userDetails.email);
    this.saveHospitalForm
      .get("phoneNumber")
      .setValue(this.userDetails.phoneNumber);
  }
  updateData(data) {
    console.log(data);
    let dataToPass = {
      user_id: this.user_id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      phoneCountry: this.userData.phoneCountry,
    };

    this.commonServ.updateProfileDetails(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "", {
            timeOut: 1000,
          });
          this.isEdit = false;
          this.getProfDetails();
          // window.location.reload();
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
  cancelUpdate() {
    this.isEdit = false;
    this.saveHospitalForm.reset();
  }

  getProfDetails() {
    let dataToPass = {
      user_id: this.user_id,
    };
    this.commonServ.getProfileDetails(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.userDetails = data.data;

          // window.location.reload();
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
}
