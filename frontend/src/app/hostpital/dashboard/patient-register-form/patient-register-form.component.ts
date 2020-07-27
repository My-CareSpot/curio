import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Form, Validators } from "@angular/forms";
import { CommonService } from "src/app/common.service";
import { LocalService } from "src/app/local.service";
import { countries } from "../../../country";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-patient-register-form",
  templateUrl: "./patient-register-form.component.html",
  styleUrls: ["./patient-register-form.component.scss"],
})
export class PatientRegisterFormComponent implements OnInit {
  userData: any;
  isLinear: boolean;
  basicDetailForm: FormGroup;
  passwordPattern: any = /^[A-Za-z0-9_@./#&+-]*$/
  medicalHistoryForm: FormGroup;
  socialHistoryForm: FormGroup;
  immunizationHistoryForm: FormGroup;
  medicationHistoryForm: FormGroup;
  familyHistoryForm: FormGroup;
  countriesList: any = countries;
  genderList: any = ["Male", "Female"];
  relationshipList: any = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Wife",
    "Daughter",
    "Son",
  ];
  frequencies = ["Daily", "Ocassionally", "Never"];

  hospital_id: any;
  user_id: any;
  constructor(
    private fb: FormBuilder,
    private commonServ: CommonService,
    private localServ: LocalService,
    private router: Router,
    private toastServ: ToastrService
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.hospital_id = this.userData._id;
    this.basicDetailForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      middleName: [null],
      phoneCountry: [""],
      phoneNumber: ["", Validators.required],
      countryCode: [""],
      profession: [""],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      gender: [""],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(this.passwordPattern),
        ]),
      ],
    });
    this.medicalHistoryForm = this.fb.group({
      diagnosis: [""],
      ageofdiagnose: [""],
      note: [""],
      allergies: [""],
    });
    this.socialHistoryForm = this.fb.group({
      alcohol: [""],
      tobaco: [""],
      smoking: [""],
      drugs: [""],
      travel: [""],
    });
    this.immunizationHistoryForm = this.fb.group({
      vaccine: [""],
      date: [""],
    });
    this.medicationHistoryForm = this.fb.group({
      drug: [""],
      strength: [""],
      dose: [""],
      medicationroute: [""],
      direction: [""],
    });
    this.familyHistoryForm = this.fb.group({
      firstName: [""],
      lastName: [""],
      dateofbirth: [""],
      relationship: [""],
      diagnosis: [""],
      ageofdiagnose: [""],
      note: [""],
    });

    this.basicDetailForm
      .get("phoneCountry")
      .valueChanges.subscribe((data: any) => {
        this.basicDetailForm.get("countryCode").setValue(data);
        this.basicDetailForm.get("countryCode").updateValueAndValidity();
      });
  }

  get password() {
    return this.basicDetailForm.get("password");
  }

  submitAllDetails() {
    let dataToPass = {
      firstName: this.basicDetailForm.value.firstName,
      lastName: this.basicDetailForm.value.lastName,
      middleName: this.basicDetailForm.value.middleName,
      phoneCountry: this.basicDetailForm.value.phoneCountry,
      phoneNumber: this.basicDetailForm.value.phoneNumber,
      countryCode: this.basicDetailForm.value.countryCode,
      profession: this.basicDetailForm.value.profession,
      email: this.basicDetailForm.value.email,
      gender: this.basicDetailForm.value.gender,
      password: this.basicDetailForm.value.password,
      hospital_id: this.hospital_id,
      userType:"patient"
    };
    this.commonServ.register(dataToPass).subscribe((data: any) => {
      if (data.code === 200) {
        this.user_id = data.data._id;
        this.addPatient();
        this.addSocialHistory(this.socialHistoryForm.value);
        this.addMedicationHistory(this.medicationHistoryForm.value);
        this.addMedicalHistory(this.medicalHistoryForm.value);
        this.addImmunizationHistory(this.immunizationHistoryForm.value);
        this.addFamilyHistory(this.familyHistoryForm.value);
        this.router.navigate(["dashboard/patient-list"]);
        this.toastServ.success(data.message, "", {
          timeOut: 1000,
        });
      } else if (data.code === 400) {
        this.toastServ.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }

  addSocialHistory(data) {
    data.user_id = this.user_id;
    this.commonServ.addSocialHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
      } else if (data.code === 400) {
        console.log("social");
        this.toastServ.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
  addFamilyHistory(data) {
    data.user_id = this.user_id;
    this.commonServ.addFamilyHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
      } else if (data.code === 400) {
        console.log("family");
        this.toastServ.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
  addMedicationHistory(data) {
    data.user_id = this.user_id;
    this.commonServ.addMedicationHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
      } else if (data.code === 400) {
        console.log("medication");
        this.toastServ.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
  addMedicalHistory(data) {
    data.user_id = this.user_id;
    this.commonServ.addMedicalHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
      } else if (data.code === 400) {
        console.log("medical");
        this.toastServ.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
  addImmunizationHistory(data) {
    data.user_id = this.user_id;
    this.commonServ.addImmunizationHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
      } else if (data.code === 400) {
        console.log("immunization");
        this.toastServ.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
  addPatient() {
    let object = {
      user_id: this.user_id,
      hospital_id: this.hospital_id,
    };
    this.commonServ.addPatient(object).subscribe(
      (data: any) => {
        if (data.code === 200) {
          // this.toastserv.success(data.message, "", {
          //   timeOut: 1000
          // });
          //this.adressInfo();
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", {
            timeOut: 1000,
          });
        }
      },
      (error) => {
        this.toastServ.error(error.error, "", {
          timeOut: 1000,
        });
      }
    );
  }
}
