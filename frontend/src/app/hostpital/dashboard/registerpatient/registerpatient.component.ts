import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FormGroup, FormArray } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";
import { countries } from "../../../country";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { StorageService } from "src/app/storage.service";
import { disableCursor } from "@fullcalendar/core";
export interface Food {
  value: string;
  display: string;
}
@Component({
  selector: "app-registerpatient",
  templateUrl: "./registerpatient.component.html",
  styleUrls: ["./registerpatient.component.scss"],
})
export class RegisterpatientComponent implements OnInit {
  userData: any;
  isLinear: boolean;
  basicDetailForm: FormGroup;
  picker: any;
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
  fetchedUserData: any;

  /////////////old code///////////////
  countries: any;
  // user_id: any;
  // userData: any;
  // isLinear: any;
  queryParamsString: any;
  originalString: any;
  emailString: any;
  userIdString: any;
  orgEmailString: any;
  userID: any;
  emailID: any;
  orgUserIdString: any;

  addressType = [
    { value: "home", name: "Home" },
    { value: "office", name: "Office" },
  ];
  patientForm: FormGroup;
  thirdFormGroup: FormGroup;
  constructor(
    private fb: FormBuilder,
    private commonServ: CommonService,
    private toastServ: ToastrService,
    private router: Router,
    private localServ: LocalService,
    private activatedRoute: ActivatedRoute,
    private storageServ: StorageService
  ) { }
  ngOnInit() {
    this.countries = countries;

    this.queryParamsString = this.activatedRoute.snapshot.params.id;

    let hasHToken = {
      hashToken: this.queryParamsString,
    };

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
      vaccination: this.fb.array([this.getVaccination()]),
    });
    this.medicationHistoryForm = this.fb.group({
      drug: [""],
      strength: [""],
      dose: [""],
      medicationroute: [""],
      direction: [""],
    });
    this.familyHistoryForm = this.fb.group({
      familyhistory: this.fb.array([this.getFamily()]),
    });
    this.basicDetailForm
      .get("phoneCountry")
      .valueChanges.subscribe((data: any) => {
        this.basicDetailForm.get("countryCode").setValue(data);
        this.basicDetailForm.get("countryCode").updateValueAndValidity();
      });

    this.commonServ.checkToken(hasHToken).subscribe((data: any) => {
      if (data.code === 200) {
        this.fetchedUserData = data.data;
        console.log("FETCH", this.fetchedUserData);
        if (this.fetchedUserData) {
          this.hospital_id = this.fetchedUserData.hospital_id;
          this.basicDetailForm
            .get("email")
            .setValue(this.fetchedUserData.email);
          this.basicDetailForm.get("email").disable();
          this.basicDetailForm.updateValueAndValidity();
        }
        this.user_id = this.fetchedUserData._id;
      } else if (data.code === 400) {
        this.toastServ.error(data.message, "", {
          timeOut: 1000,
        });
        this.router.navigate(["dashboard/page-not-found"]);
      }
    });
  }

  get vaccinationListArray() {
    return <FormArray>this.immunizationHistoryForm.get("vaccination");
  }

  get familyListArray() {
    return <FormArray>this.familyHistoryForm.get("familyhistory");
  }

  addFamily() {
    this.familyListArray.push(this.getFamily());
  }
  removeFamily(index) {
    this.familyListArray.removeAt(index);
  }
  removeVaccination(index) {
    this.vaccinationListArray.removeAt(index);
  }

  checkData(data) { }

  addVaccination() {
    this.vaccinationListArray.push(this.getVaccination());
  }

  getVaccination() {
    return this.fb.group({
      vaccine: [""],
      date: [""],
    });
  }

  getFamily() {
    return this.fb.group({
      firstName: [""],
      lastName: [""],
      dateofbirth: [""],
      relationship: [""],
      diagnosis: [""],
      ageofdiagnose: [""],
      note: [""],
    });
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
      email: this.emailID,
      gender: this.basicDetailForm.value.gender,
      password: this.basicDetailForm.value.password,
      hospital_id: this.hospital_id,
      _id: this.fetchedUserData._id,
      userType:"patient"
    };
    this.commonServ.updateAddPatientData(dataToPass).subscribe((data: any) => {
      if (data.code === 200) {
        //this.addPatient();
        this.addSocialHistory(this.socialHistoryForm.value);
        this.addMedicationHistory(this.medicationHistoryForm.value);
        this.addMedicalHistory(this.medicalHistoryForm.value);
        this.addImmunizationHistory(this.immunizationHistoryForm.value);
        this.addFamilyHistory(this.familyHistoryForm.value);
        this.router.navigate(["/dashboard/thank-you"]);
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
  addSocialHistory(data) {
    data.user_id = this.user_id;
    this.commonServ.addSocialHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
      } else if (data.code === 400) {
        console.log("social");
        // this.toastServ.error(data.message, "", {
        //   timeOut: 1000,
        // });
      }
    });
  }
  addFamilyHistory(data) {
    let dataToPass = [];
    console.log("DATA", data.familyhistory);
    data.familyhistory.forEach(async (element) => {
      element.user_id = this.user_id;
      dataToPass.push(element);
    });

    console.log("DATATOPASS", dataToPass);
    this.commonServ.addManyFamilyHistory(dataToPass).subscribe((data: any) => {
      if (data.code === 200) {
      } else if (data.code === 400) {
        console.log("family");
        // this.toastServ.error(data.message, "", {
        //   timeOut: 1000,
        // });
      }
    });
  }
  get password() {
    return this.basicDetailForm.get("password");
  }
  addMedicationHistory(data) {
    data.user_id = this.user_id;
    this.commonServ.addMedicationHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
      } else if (data.code === 400) {
        console.log("medication");
        // this.toastServ.error(data.message, "", {
        //   timeOut: 1000,
        // });
      }
    });
  }
  addMedicalHistory(data) {
    data.user_id = this.user_id;
    this.commonServ.addMedicalHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
      } else if (data.code === 400) {
        console.log("medical");
        // this.toastServ.error(data.message, "", {
        //   timeOut: 1000,
        // });
      }
    });
  }
  addImmunizationHistory(data) {
    let dataToPass = [];
    console.log("DATA", data.vaccination);
    data.vaccination.forEach(async (element) => {
      element.user_id = this.user_id;
      dataToPass.push(element);
    });

    console.log("DATATOPASS", dataToPass);

    this.commonServ
      .addManyImmunizationHistory(dataToPass)
      .subscribe((data: any) => {
        if (data.code === 200) {
        } else if (data.code === 400) {
          console.log("immunization");
          // this.toastServ.error(data.message, "", {
          //   timeOut: 1000,
          // });
        }
      });
  }
}
