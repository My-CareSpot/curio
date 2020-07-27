import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";
import { countries } from "../../../country";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { LocalService } from "src/app/local.service";
export interface Food {
  value: string;
  display: string;
}
@Component({
  selector: "app-careregister",
  templateUrl: "./careregister.component.html",
  styleUrls: ["./careregister.component.scss"],
})
export class CareregisterComponent implements OnInit {
  countries: any;
  careMemberData: any;
  user_id: any;
  userData: any;
  specialization_id: any;
  specializationData: any;
  isLinear: any;
  genderList = [
    { value: "male", name: "Male" },
    { value: "female", name: "Female" },
  ];
  addressType = [
    { value: "home", name: "Home" },
    { value: "office", name: "Office" },
  ];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private commonServ: CommonService,
    private toastserv: ToastrService,
    private router: Router,
    private localServ: LocalService
  ) {}
  ngOnInit() {
    this.countries = countries;
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.specializationType();
    this.user_id = this.userData._id;
    this.firstFormGroup = this._formBuilder.group({
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      gender: ["", Validators.required],
      profession: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      phonecountry: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      category: ["", Validators.required],
      description: ["", Validators.required],
      qualification: ["", Validators.required],
      registrationNumber: ["", Validators.required],
      rating: ["", Validators.required],
      specialaization: ["", Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      houseNo: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      country: ["", Validators.required],
      zip: ["", Validators.required],
      addressType: ["", Validators.required],
      street: ["", Validators.required],
      street2: [""],
    });
  }
  specializationType() {
    let obj = {
      type: "specializations",
    };
    this.commonServ.getspecialization(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.specializationData = data.data;
        }
      },
      (error) => {
        this.toastserv.error(error.error, "", {
          timeOut: 1000,
        });
      }
    );
  }
  submitAllInfo() {
    let caretakerData = this.firstFormGroup.value;
    if(this.secondFormGroup.value && this.secondFormGroup.value.specialaization){
      this.specializationData.forEach(element => {
        if(element._id == this.secondFormGroup.value.specialaization ){
          caretakerData.userType = element['specialization'].toLowerCase();
        }
        
      });
    }
    this.commonServ.register(caretakerData).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.careMemberData = data.data;
          // this.toastserv.success(data.message, "", {
          //   timeOut: 1000,
          // });
          this.caretakerInfo();
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

  caretakerInfo() {
    let dataToPass = {
      category: this.secondFormGroup.value.category,
      description: this.secondFormGroup.value.description,
      qualification: this.secondFormGroup.value.qualification,
      rating: this.secondFormGroup.value.rating,
      registrationNumber: this.secondFormGroup.value.registrationNumber,
      specialization_id: this.secondFormGroup.value.specialaization,
      hospital_id: this.user_id,
      user_id: this.careMemberData._id,
    };

    this.commonServ.caretaker(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          // this.toastserv.success(data.message, "", {
          //   timeOut: 1000,
          // });
          this.adressInfo();
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
  adressInfo() {
    this.commonServ.address(this.thirdFormGroup.value, this.user_id).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastserv.success(data.message, "", {
            timeOut: 1000,
          });
          this.router.navigate(["dashboard/care-team"]);
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
}
