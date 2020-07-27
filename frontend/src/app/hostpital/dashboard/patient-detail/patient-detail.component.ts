import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDatepicker,
} from "@angular/material";
import { CommonService } from "src/app/common.service";
import swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { LocalService } from "src/app/local.service";
import { AddDosageDialogComponent } from "../../add-dosage-dialog/add-dosage-dialog.component";
import { AllserviceService } from "src/app/allservice.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
export function filterListBySearchStringOnDisplayedColumns(
  searchString: string,
  targetList: any[],
  targetColumns: string[]
) {
  let searchedList: any[] = [];
  let _targetList: any[] = targetList.map((s) => Object.assign({}, s));
  for (var i = 0; i < _targetList.length; i++) {
    for (var j = 0; j < targetColumns.length; j++) {
      let obj = _targetList[i];
      let column = targetColumns[j];
      let val = obj[column];
      let value = val ? val.toString().toLowerCase() : "";
      let found = value.includes(searchString);
      if (found) {
        searchedList.push(_targetList[i]);
        break;
      }
    }
  }
  return searchedList;
}

@Component({
  selector: "app-patient-detail",
  templateUrl: "./patient-detail.component.html",
  styleUrls: ["./patient-detail.component.scss"],
})
export class PatientDetailComponent implements OnInit {
  userRoleId = 0;
  deafultUrl: any = "../../../../assets/img/nicolas-profile.png";
  finalURL: any;
  userData: any;
  familyFormGroup: FormGroup;
  changePasswordForm: FormGroup;
  imageUploadForm: FormGroup;
  isEditUser: any;
  isChangePassword: boolean;
  picker: any;
  updateUserForm: FormGroup;
  familyHistoryForm: FormGroup;
  medicalHistoryForm: FormGroup;
  passwordPattern: any = /^[A-Za-z0-9_@./#&+-]*$/
  showPasswordError: boolean;
  isValidForm: boolean = true;
  socialHistoryForm: FormGroup;
  frequencies = ["Daily", "Ocassionally", "Never"];
  immunizationHistoryForm: FormGroup;
  medicationHistoryForm: FormGroup;
  medicalHistoryDatatList: any;
  socialHistoryDataList: any;
  medicationHistoryDataList: any;
  immunizationHistoryDataList: any;
  familyHistoryDataList: any;
  relationshipList: any = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Wife",
    "Daughter",
    "Son",
  ];

  familyDataToUpdate: any;
  socialDataToUpdate: any;
  medicalDataToUpdate: any;
  medicationDataToUpdate: any;
  immunizationDataToUpdate: any;

  isUpdateButton: boolean;

  isEditFamily: boolean;
  isEditSocial: boolean;
  isEditMedical: boolean;
  isEditMedication: boolean;
  isEditImmunization: boolean;

  familyHistoryDataLength: any;
  medicationHistoryDataLength: any;
  medicalHistoryDataLength: any;
  socialHistoryDataLength: any;
  immunizationHistoryDataLength: any;

  user_id: any;
  Name: any;
  Visit: any;
  length: any;
  patientInfo: any;
  userId = 0; // will be used service to get userd id which was saved after login $$..
  clientId: number = 0;
  patientsList: any[] = [];
  queryParamsString: any;
  dosageList: any[] = [];

  genderList: ["Male", "Female"];

  mainPatientsList: any[] = [];
  mainPatientsList1: any[] = [];
  displayedColumns: string[] = [
    "Medicine-Name",
    "From",
    "To",
    "Quantity",
    "Time",
  ];
  displayedColumns1: string[] = [
    "medicineName",
    "isMorning",
    "isAfternoon",
    "isEvening",
    "startDate",
    "endDate",
  ];

  displayedColumns2: string[] = [
    "diagnosis",
    "firstName",
    "lastName",
    "ageofdiagnosis",
    "note",
    "relationship",
    "dateofbirth",
    "action",
  ];
  displayedColumns3: string[] = [
    "diagnosis",
    "ageofdiagnosis",
    "allergies",
    "note",
    "action",
  ];

  displayedColumns4: string[] = [
    "drug",
    "strength",
    "dose",
    "medicationroute",
    "direction",
    "action",
  ];

  displayedColumns5: string[] = [
    "alcohol",
    "tobaco",
    "smoking",
    "drugs",
    "travel",
    "action",
  ];

  displayedColumns6: string[] = ["vaccine", "date", "action"];

  // dataSource = this.patientsList;

  dataSource = new MatTableDataSource<any[]>();
  dataSource1 = new MatTableDataSource<any[]>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  datetime: string;
  dosageLength: any;
  patient_id: any;
  srcUrl: any;

  ngAfterViewInit() {
    this.setTable();
    this.setTable1();
  }

  updateAfterSearchInList() {
    this.paginator.pageIndex = 0;
    this.setTable();
  }
  updateAfterSearchInList1() {
    this.paginator.pageIndex = 0;
    this.setTable1();
  }
  setTable() {
    this.dataSource = new MatTableDataSource(this.patientsList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  setTable1() {
    this.dataSource1 = new MatTableDataSource(this.dosageList);
    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
  }

  constructor(
    public dialog: MatDialog,
    private commonServ: CommonService,
    private toastserv: ToastrService,
    private router: Router,
    private localServ: LocalService,
    private allService: AllserviceService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.queryParamsString = this.activatedRoute.snapshot.params.id;
    this.allService.setUserId(this.queryParamsString);
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.getList();
    this.getDosageList();

    this.getPatientInfo();
    this.getSocialHistoryData();
    this.getMedicalHistoryData();
    this.getMedicationHistoryData();
    this.getImmunizationData();
    this.getFamilyHistoryData();

    this.length = this.patientsList.length;
    this.length = this.dosageList.length;

    this.imageUploadForm = this.fb.group({
      image_path: ["", Validators.required],
      patient_id: ["", Validators.required],
    });

    this.updateUserForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      middleName: ["", Validators.required],
      email: ["", Validators.required],
      phoneNumber: ["", Validators.required],
    });

    this.changePasswordForm = this.fb.group({
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(this.passwordPattern),
        ]),
      ],
      confirmpassword: ["", Validators.required],
    });

    this.familyHistoryForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dateofbirth: ["", Validators.required],
      relationship: ["", Validators.required],
      diagnosis: ["", Validators.required],
      ageofdiagnose: ["", Validators.required],
      note: ["", Validators.required],
    });
    this.medicalHistoryForm = this.fb.group({
      diagnosis: ["", Validators.required],
      ageofdiagnose: ["", Validators.required],
      note: ["", Validators.required],
      allergies: ["", Validators.required],
    });

    this.socialHistoryForm = this.fb.group({
      alcohol: ["", Validators.required],
      tobaco: ["", Validators.required],
      smoking: ["", Validators.required],
      drugs: ["", Validators.required],
      travel: ["", Validators.required],
    });
    this.immunizationHistoryForm = this.fb.group({
      vaccine: ["", Validators.required],
      date: ["", Validators.required],
    });
    this.medicationHistoryForm = this.fb.group({
      drug: ["", Validators.required],
      strength: ["", Validators.required],
      dose: ["", Validators.required],
      medicationroute: ["", Validators.required],
      direction: ["", Validators.required],
    });

    this.changePasswordForm
      .get("confirmpassword")
      .valueChanges.subscribe((data: any) => {
        if (this.changePasswordForm.get("password").value !== data) {
          this.showPasswordError = true;
          this.isValidForm = true;
        } else if (this.changePasswordForm.get("password").value === data) {
          this.showPasswordError = false;
          this.isValidForm = false;
        }
      });
  }

  getList() {
    this.patientsList = [
      {
        "Medicine-Name": "Tab1",
        From: "03/22/2020",
        To: "04/22/2020",
        Quantity: "500mg",
        Time: "Morning",
      },
      {
        "Medicine-Name": "Tab2",
        From: "03/22/2020",
        To: "04/22/2020",
        Quantity: "500mg",
        Time: "Evening",
      },
      {
        "Medicine-Name": "Tab3",
        From: "03/22/2020",
        To: "04/22/2020",
        Quantity: "500mg",
        Time: "Night",
      },
      {
        "Medicine-Name": "Tab4",
        From: "03/22/2020",
        To: "04/22/2020",
        Quantity: "500mg",
        Time: "Morning",
      },
    ];

    this.mainPatientsList = this.patientsList.map((s) => Object.assign(s));
    this.setTable();
    // this.dataSource = this.patientsList;
  }

  get password() {
    return this.changePasswordForm.get("password");
  }

  dateChangeValue(event) {
    const date = new Date(event),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    this.datetime = [date.getFullYear(), month, day].join("-");
  }
  openDialogforAddDosage() {
    const dialogRef = this.dialog.open(AddDosageDialogComponent, {
      width: "800px",
      data: {
        // type: type,
        // data: data
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDosageList();
        // show success message $$..
      }
    });
  }
  applyFilter(filterValue: any) {
    filterValue = filterValue.trimLeft();
    filterValue = filterValue.trim().toLowerCase();
    if (!filterValue || filterValue == "") {
      this.patientsList = this.mainPatientsList.map((s) => Object.assign(s));
      // this.dosageList = this.mainPatientsList1.map(s => Object.assign(s));
      this.updateAfterSearchInList();
      this.updateAfterSearchInList1();
      // this.dataSource = this.patientsList;
    } else {
      let targetColumns = ["patientId", "name", "age", "location"];
      this.patientsList = filterListBySearchStringOnDisplayedColumns(
        filterValue,
        this.mainPatientsList,
        targetColumns
      ).map((s) => Object.assign(s));
      this.updateAfterSearchInList();
    }
  }
  getDosageList() {
    let obj = {
      user_id: this.queryParamsString,
    };
    this.commonServ.getDosageList(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.dosageList = data.data;
          this.mainPatientsList1 = this.dosageList;
          this.dosageLength = data.data.length;
          this.setTable1();
          for (var i = 0; i < this.dosageList.length; i++) { }
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
  getPatientInfo() {
    let obj = {
      user_id: this.queryParamsString,
    };
    this.commonServ.getPatientInfo(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.patientInfo = data.data[0];
          this.srcUrl = environment.socketUrl + data.data[0].image_path;
          if (
            data.data[0].image_path === undefined ||
            data.data[0].image_path === null
          ) {
            this.finalURL = this.deafultUrl;
          } else {
            this.finalURL = this.srcUrl;
          }
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
  getMedicalHistoryData() {
    let obj = {
      user_id: this.queryParamsString,
    };
    this.commonServ.getMedical(obj).subscribe(
      (data: any) => {
        console.log("DataMedical", data.data);
        if (data.code === 200) {
          this.medicalHistoryDatatList = data.data;
          this.medicalHistoryDataLength = this.medicalHistoryDatatList.length;
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
  getMedicationHistoryData() {
    let obj = {
      user_id: this.queryParamsString,
    };
    this.commonServ.getMedication(obj).subscribe(
      (data: any) => {
        console.log("Data", data.data);
        if (data.code === 200) {
          this.medicationHistoryDataList = data.data;
          this.medicationHistoryDataLength = this.medicationHistoryDataList.length;
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

  getSocialHistoryData() {
    let obj = {
      user_id: this.queryParamsString,
    };
    this.commonServ.getSocialHistory(obj).subscribe(
      (data: any) => {
        console.log("Data", data.data);
        if (data.code === 200) {
          this.socialHistoryDataList = data.data;
          this.socialHistoryDataLength = this.socialHistoryDataList.length;
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
  getImmunizationData() {
    let obj = {
      user_id: this.queryParamsString,
    };
    this.commonServ.getImmunization(obj).subscribe(
      (data: any) => {
        console.log("DataImm", data.data);
        if (data.code === 200) {
          this.immunizationHistoryDataList = data.data;
          this.immunizationHistoryDataLength = this.immunizationHistoryDataList.length;
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

  getFamilyHistoryData() {
    let obj = {
      user_id: this.queryParamsString,
    };
    this.commonServ.getFamilyHistory(obj).subscribe(
      (data: any) => {
        console.log("DataFamily", data.data);
        if (data.code === 200) {
          this.familyHistoryDataList = data.data;
          this.familyHistoryDataLength = this.familyHistoryDataList.length;
          console.log("LAA", this.familyHistoryDataLength);
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

  deleteFamilyAlert(data) {
    let obj = {
      _id: data,
    };
    swal
      .fire({
        title: "Are you sure?",
        text: "You want to delete!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.value) {
          this.commonServ.deleteFamily(obj).subscribe((data: any) => {
            if (data.code === 200) {
              swal.fire("Deleted!", "Your record has been deleted.", "success");
              this.getFamilyHistoryData();
            } else if (data.code === 400) {
              this.toastserv.error(data.message, "", {
                timeOut: 1000,
              });
            }
          });
        }
      });
  }
  deleteImmunizationAlert(data) {
    let obj = {
      _id: data,
    };
    swal
      .fire({
        title: "Are you sure?",
        text: "You want to delete!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.value) {
          this.commonServ.deleteImmunization(obj).subscribe((data: any) => {
            if (data.code === 200) {
              swal.fire("Deleted!", "Your record has been deleted.", "success");
              this.getImmunizationData();
            } else if (data.code === 400) {
              this.toastserv.error(data.message, "", {
                timeOut: 1000,
              });
            }
          });
        }
      });
  }
  deleteMedicalAlert(data) {
    let obj = {
      _id: data,
    };
    swal
      .fire({
        title: "Are you sure?",
        text: "You want to delete!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.value) {
          this.commonServ.deleteMedical(obj).subscribe((data: any) => {
            if (data.code === 200) {
              swal.fire("Deleted!", "Your record has been deleted.", "success");
              this.getMedicalHistoryData();
            } else if (data.code === 400) {
              this.toastserv.error(data.message, "", {
                timeOut: 1000,
              });
            }
          });
        }
      });
  }
  deleteMedicationAlert(data) {
    let obj = {
      _id: data,
    };
    swal
      .fire({
        title: "Are you sure?",
        text: "You want to delete!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.value) {
          this.commonServ.deleteMedication(obj).subscribe((data: any) => {
            if (data.code === 200) {
              swal.fire("Deleted!", "Your record has been deleted.", "success");
              this.getMedicationHistoryData();
            } else if (data.code === 400) {
              this.toastserv.error(data.message, "", {
                timeOut: 1000,
              });
            }
          });
        }
      });
  }
  deleteSocialAlert(data) {
    let obj = {
      _id: data,
    };
    swal
      .fire({
        title: "Are you sure?",
        text: "You want to delete!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.value) {
          this.commonServ.deleteSocialHistory(obj).subscribe((data: any) => {
            if (data.code === 200) {
              swal.fire("Deleted!", "Your record has been deleted.", "success");
              this.getSocialHistoryData();
            } else if (data.code === 400) {
              this.toastserv.error(data.message, "", {
                timeOut: 1000,
              });
            }
          });
        }
      });
  }

  openEditFamily(data) {
    this.familyDataToUpdate = data;
    this.isEditFamily = true;
    this.isUpdateButton = true;
    this.familyHistoryForm
      .get("relationship")
      .setValue(this.familyDataToUpdate.relationship);
    this.familyHistoryForm
      .get("firstName")
      .setValue(this.familyDataToUpdate.firstName);
    this.familyHistoryForm
      .get("lastName")
      .setValue(this.familyDataToUpdate.lastName);
    this.familyHistoryForm
      .get("diagnosis")
      .setValue(this.familyDataToUpdate.diagnosis);
    this.familyHistoryForm
      .get("ageofdiagnose")
      .setValue(this.familyDataToUpdate.ageofdiagnose);
    this.familyHistoryForm
      .get("dateofbirth")
      .setValue(this.familyDataToUpdate.dateofbirth);
    this.familyHistoryForm.get("note").setValue(this.familyDataToUpdate.note);
  }

  openEditMedical(data) {
    this.medicalDataToUpdate = data;
    this.isEditMedical = true;
    this.isUpdateButton = true;
    this.medicalHistoryForm
      .get("diagnosis")
      .setValue(this.medicalDataToUpdate.diagnosis);
    this.medicalHistoryForm
      .get("ageofdiagnose")
      .setValue(this.medicalDataToUpdate.ageofdiagnose);
    this.medicalHistoryForm
      .get("allergies")
      .setValue(this.medicalDataToUpdate.allergies);
    this.medicalHistoryForm.get("note").setValue(this.medicalDataToUpdate.note);
  }

  openEditMedication(data) {
    this.medicationDataToUpdate = data;
    this.isEditMedication = true;
    this.isUpdateButton = true;
    this.medicationHistoryForm
      .get("drug")
      .setValue(this.medicationDataToUpdate.drug);
    this.medicationHistoryForm
      .get("strength")
      .setValue(this.medicationDataToUpdate.strength);
    this.medicationHistoryForm
      .get("dose")
      .setValue(this.medicationDataToUpdate.dose);
    this.medicationHistoryForm
      .get("medicationroute")
      .setValue(this.medicationDataToUpdate.medicationroute);
    this.medicationHistoryForm
      .get("direction")
      .setValue(this.medicationDataToUpdate.direction);
  }

  openEditSocial(data) {
    this.socialDataToUpdate = data;
    this.isEditSocial = true;
    this.isUpdateButton = true;
    this.socialHistoryForm
      .get("alcohol")
      .setValue(this.socialDataToUpdate.alcohol);
    this.socialHistoryForm
      .get("tobaco")
      .setValue(this.socialDataToUpdate.tobaco);
    this.socialHistoryForm
      .get("smoking")
      .setValue(this.socialDataToUpdate.smoking);
    this.socialHistoryForm.get("drugs").setValue(this.socialDataToUpdate.drugs);
    this.socialHistoryForm
      .get("travel")
      .setValue(this.socialDataToUpdate.travel);
  }
  openEditImmunization(data) {
    this.immunizationDataToUpdate = data;
    this.isEditImmunization = true;
    this.isUpdateButton = true;
    this.immunizationHistoryForm
      .get("vaccine")
      .setValue(this.immunizationDataToUpdate.vaccine);
    this.immunizationHistoryForm
      .get("date")
      .setValue(this.immunizationDataToUpdate.date);
  }

  cancelDialog() {
    this.isEditFamily = false;
    this.isEditImmunization = false;
    this.isEditUser = false;
    this.isEditMedical = false;
    this.isEditMedication = false;
    this.isChangePassword = false;

    this.isEditSocial = false;
    this.changePasswordForm.reset();
    this.updateUserForm.reset();
    this.familyHistoryForm.reset();
    this.medicalHistoryForm.reset();
    this.socialHistoryForm.reset();
    this.medicationHistoryForm.reset();
    this.immunizationHistoryForm.reset();
  }

  openAddFamilyDialog() {
    this.isEditFamily = true;
  }
  openAddSocialDialog() {
    this.isEditSocial = true;
  }
  openAddMedicalDialog() {
    this.isEditMedical = true;
  }
  openAddMedicationDialog() {
    this.isEditMedication = true;
  }
  openAddImmunizationDialog() {
    this.isEditImmunization = true;
  }

  submitFamilyHistory(data) {
    data.user_id = this.queryParamsString;
    this.commonServ.addFamilyHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success("Update Success", "", {
          timeOut: 1000,
        });
        this.getFamilyHistoryData();
        this.isEditFamily = false;
        this.familyHistoryForm.reset();
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }

  submitMedicalHistory(data) {
    data.user_id = this.queryParamsString;
    this.commonServ.addMedicalHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success("Added Success", "", {
          timeOut: 1000,
        });
        this.getMedicalHistoryData();
        this.isEditMedical = false;
        this.medicalHistoryForm.reset();
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
  submitMedicationHistory(data) {
    data.user_id = this.queryParamsString;
    this.commonServ.addMedicationHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success("Added Success", "", {
          timeOut: 1000,
        });
        this.getMedicationHistoryData();
        this.isEditMedication = false;
        this.medicationHistoryForm.reset();
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }

  submitSocialHistory(data) {
    data.user_id = this.queryParamsString;
    this.commonServ.addSocialHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success("Added Success", "", {
          timeOut: 1000,
        });
        this.getSocialHistoryData();
        this.isEditSocial = false;
        this.socialHistoryForm.reset();
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }

  submitImmunizationHistory(data) {
    data.user_id = this.queryParamsString;
    this.commonServ.addImmunizationHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success("Added Success", "", {
          timeOut: 1000,
        });
        this.getImmunizationData();
        this.isEditImmunization = false;
        this.immunizationHistoryForm.reset();
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }

  updateFamilyHistory(data) {
    data._id = this.familyDataToUpdate._id;
    this.commonServ.updateFamilyHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success("Update Success", "", {
          timeOut: 1000,
        });
        this.getFamilyHistoryData();
        this.familyHistoryForm.reset();
        this.isEditFamily = false;
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
  updateMedicalHistory(data) {
    data._id = this.medicalDataToUpdate._id;
    this.commonServ.updateMedicalHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success("Update Success", "", {
          timeOut: 1000,
        });
        this.getMedicalHistoryData();
        this.medicalHistoryForm.reset();
        this.isEditMedical = false;
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
  updateMedicationHistory(data) {
    data._id = this.medicationDataToUpdate._id;
    this.commonServ.updateMedicationHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success("Update Success", "", {
          timeOut: 1000,
        });
        this.getMedicationHistoryData();
        this.medicationHistoryForm.reset();
        this.isEditMedication = false;
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
  updateSocialHistory(data) {
    data._id = this.medicationDataToUpdate._id;
    this.commonServ.updateSocialHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success("Update Success", "", {
          timeOut: 1000,
        });
        this.getSocialHistoryData();
        this.socialHistoryForm.reset();
        this.isEditSocial = false;
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
  updateImmunizationHistory(data) {
    data._id = this.immunizationDataToUpdate._id;
    this.commonServ.updateImmunizationHistory(data).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success("Update Success", "", {
          timeOut: 1000,
        });
        this.getImmunizationData();
        this.immunizationHistoryForm.reset();
        this.isEditImmunization = false;
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }

  updateUser() {
    this.isEditUser = true;
    this.updateUserForm.get("firstName").setValue(this.patientInfo.firstName);
    this.updateUserForm.get("lastName").setValue(this.patientInfo.lastName);
    this.updateUserForm.get("middleName").setValue(this.patientInfo.middleName);
    this.updateUserForm.get("email").setValue(this.patientInfo.email);
    this.updateUserForm
      .get("phoneNumber")
      .setValue(this.patientInfo.phoneNumber);
  }

  uploadImage(event) {
    console.log("EVENT", event);
    const file = (event.target as HTMLInputElement).files[0];
    console.log("DFILE", file);
    this.patient_id = this.queryParamsString;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("patient_id", this.patient_id);

    this.commonServ.imageUpload(uploadData).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success(data.message, "", {
          timeOut: 1000,
        });
        this.getPatientInfo();
      } else if (data.code === 400) {
        this.toastserv.success(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }

  updateUserDetails(data) {
    this.commonServ
      .updatePatient(data, this.queryParamsString)
      .subscribe((data: any) => {
        if (data.code === 200) {
          this.toastserv.success("Update Success", "", {
            timeOut: 1000,
          });
          this.isEditUser = false;
          this.updateUserForm.reset();
          this.getPatientInfo();
        } else if (data.code === 400) {
          this.toastserv.error(data.message, "", {
            timeOut: 1000,
          });
        }
      });
  }

  changePasswordDialog() {
    this.isChangePassword = true;
  }
  changePassword(data) {
    let dataToPass = {
      password: data.password,
      _id: this.queryParamsString,
    };
    this.commonServ.changePasswordData(dataToPass).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success("Update Success", "", {
          timeOut: 1000,
        });
        this.isChangePassword = false;
        this.changePasswordForm.reset();
        this.getPatientInfo();
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
}
