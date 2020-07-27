import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalService } from "src/app/local.service";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import swal from "sweetalert2";

@Component({
  selector: "app-program-management",
  templateUrl: "./program-management.component.html",
  styleUrls: ["./program-management.component.scss"],
})
export class ProgramManagementComponent implements OnInit {
  userData: any;
  programList: any;
  program_id: any;
  programDataNew: any;
  isSymptom: boolean = false;
  isSideEffect: boolean = false;
  buttonName: any = "Add";
  programData: any;
  prior: any;
  isEditSymptom: boolean;
  symptom_id: any;
  sideeffect_id: any;
  isEditSideEffect: boolean;

  selectedPatients: any;
  symptomList: any;
  sideEffectList: any;
  mainProgramList: any;
  mainSymptomList: any;

  isPatients: boolean;

  isAddSymptom: boolean;
  isAddSideEffect: boolean;

  priorities = ["High", "Medium", "Low"];

  saveProgram: FormGroup;

  addSymptomForm: FormGroup;

  addSideEffectForm: FormGroup;

  isModal: boolean = false;

  displayedColumns: string[] = ["ProgramName", "ProgramAction"];

  displayedColumns1: string[] = ["SymptomName", "SymptomAction"];
  displayedColumns2: string[] = ["EffectName", "EffectAction"];

  dataSource = new MatTableDataSource<any[]>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  length: any;
  symptomLength: any;
  sideEffectLength: any;
  user_id: any;
  patientList: any;

  addPatientForm: FormGroup;
  isJournal: boolean=false;
  journalList: any;
  addJournalForm: FormGroup;

  ngAfterViewInit() {
    this.setTable();
  }

  constructor(
    private localServ: LocalService,
    private commonServ: CommonService,
    private toastServ: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.getPrograms();

    this.saveProgram = this.fb.group({
      programname: ["", Validators.required],
      lmsId: [""],
      lmsInstanceId: [""],

    });

    this.addSymptomForm = this.fb.group({
      priority: ["", Validators.required],
      symptom: ["", Validators.required],
    });
    this.addSideEffectForm = this.fb.group({
      priority: ["", Validators.required],
      sideeffect: ["", Validators.required],
    });

    this.addPatientForm = this.fb.group({
      patient_ids: ["", Validators.required],
    });

    this.addJournalForm = this.fb.group({
      journal_ids: ["", Validators.required],
    });
  }

  openAddDiaolog() {
    this.buttonName = "Add";
    this.isModal = true;
  }
  cancelModal() {
    this.isModal = false;
    this.saveProgram.reset();
  }

  deleteProgram(data) {
    let obj = {
      program_id: data._id,
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
          this.commonServ.deleteProgram(obj).subscribe((data: any) => {
            if (data.code === 200) {
              swal.fire("Deleted!", "Your record has been deleted.", "success");
              this.getPrograms();
            } else if (data.code === 400) {
              this.toastServ.error(data.message, "", {
                timeOut: 1000,
              });
            }
          });
        }
      });
  }

  addData(data) {
    let dataToPass = {
      programname: data.programname,
      lmsprogram_id:data.lmsId,
      lmsinstance_id:data.lmsInstanceId,
      hospital_user_id: this.userData._id,
    };
    this.commonServ.addProgram(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "", { timeOut: 1000 });
          this.getPrograms();
          this.isModal = false;
          this.saveProgram.reset();
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", { timeOut: 1000 });
        }
      },
      (error) => {
        this.toastServ.error(error, "", { timeOut: 1000 });
      }
    );
  }

  addSymp() {
    this.isAddSymptom = true;
  }
  addSideEff() {
    this.isAddSideEffect = true;
  }

  editOpen(data) {
    this.buttonName = "Update";
    this.programData = data;
    this.isModal = true;
    this.saveProgram.get("programname").setValue(data.programname);
    this.saveProgram.get("lmsId").setValue(data.lmsprogram_id);
    this.saveProgram.get("lmsInstanceId").setValue(data.lmsinstance_id);
  }

  submitData(data) {
    let dataToPass = {
      program_id: this.programData._id,
      programname: data.programname,
      lmsprogram_id:data.lmsId,
      lmsinstance_id:data.lmsInstanceId
    };
    this.commonServ.updateProgram(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "", { timeOut: 1000 });
          this.getPrograms();
          this.isModal = false;
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", { timeOut: 1000 });
        }
      },
      (error) => {
        this.toastServ.error(error, "", { timeOut: 1000 });
      }
    );
  }

  deleteAlert() {}

  getPrograms() {
    let dataToPass = {
      hospital_user_id: this.userData._id,
    };
    this.commonServ.getProgram(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.programList = data.data;
          this.dataSource = this.programList;

          this.mainProgramList = this.programList;
          this.setTable();
          this.length = this.programList.length;
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", {
            timeOut: 1000,
          });
        }
      },
      (error) => {
        this.toastServ.error(error, "Server error", {
          timeOut: 1000,
        });
      }
    );
  }
  updateAfterSearchInList() {
    this.paginator.pageIndex = 0;
    this.setTable();
  }

  applyFilter(filterValue: any) {
    filterValue = filterValue.trimLeft();
    filterValue = filterValue.trim().toLowerCase();
    if (!filterValue || filterValue == "") {
      this.programList = this.mainProgramList.map((s) => Object.assign(s));

      this.updateAfterSearchInList();
      // this.dataSource = this.patientsList;
    }
  }

  setTable() {
    this.dataSource = new MatTableDataSource(this.programList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openSymptom(data) {
    this.isSymptom = true;
    this.program_id = data;
    this.getSymptoms();
    // this.getPrograms();
  }
  openSideEffect(data) {
    this.isSideEffect = true;
    this.program_id = data;
    this.getSideEffect();
    // this.getPrograms();
  }

  cancelDialog() {
    this.isSideEffect = false;
    this.isSymptom = false;
    this.isAddSymptom = false;

    // this.getSideEffect();
    // this.getSymptoms();
    // this.getPrograms();
  }

  openPatient(data) {
    this.isPatients = true;
    // console.log("data", data);
    this.programDataNew = data;
    this.getPatients();
    this.programList.forEach((element) => {
      if (this.programDataNew._id === element._id) {
        console.log(element.connected_user_id);
        this.addPatientForm
          .get("patient_ids")
          .setValue(element.connected_user_id);
      }
    });
  }

  getPatients() {
    let dataToPass = {
      user_id: this.user_id,
      userType:this.userData.userType
    };

    this.commonServ.getPatientList(dataToPass).subscribe((data: any) => {
      this.patientList = data.data;
      //console.log("patientList", this.patientList);
    });
  }

  
  assignJournal(data){
    this.isJournal = true;
    this.getJournal();
    this.programDataNew = data;
    this.programList.forEach((element) => {
      if (this.programDataNew._id === element._id) {
        console.log(element.connected_user_id);
        if(element && element.journal_assigned_ids ){
          this.addJournalForm
          .get("journal_ids")
          .setValue(element.journal_assigned_ids);

        }
        
      }
    });

      
  }

  getJournal(){
    let dataToPass = {
      user_id: this.user_id
    };

    this.commonServ.getJournalList(dataToPass).subscribe((data: any) => {
      if(data.code == 200){
        this.journalList = data.data.data;
      }

    });

  }

  assignJournalToProgram(data) {
    let dataToPass = {
      program_id: this.programDataNew._id,
      journal_ids: data.journal_ids,
    };

    this.commonServ.assignJournalProgram(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "", {
            timeOut: 1000,
          });
          this.isJournal = false;
          this.getPrograms();
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

  cancelJournalDialog() {
    this.isJournal = false;
    this.addJournalForm.reset();
  }

  assignPatientToProgram(data) {
    //console.log("data", data);
    let dataToPass = {
      program_id: this.programDataNew._id,
      patient_ids: data.patient_ids,
    };

    // console.log("dataToPass", dataToPass);

    this.commonServ.assignPatientProgram(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "", {
            timeOut: 1000,
          });
          this.isPatients = false;
          this.getPrograms();
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

  cancelPatientDialog() {
    this.isPatients = false;
    this.addPatientForm.reset();
  }

  addSymptomsData(data) {
    let dataToPass = {
      program_id: this.program_id,
      priority: data.priority,
      symptom: data.symptom,
    };
    this.commonServ.addSymptom(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "", {
            timeOut: 1000,
          });
          this.getSymptoms();
          //this.isSymptom = false;

          this.addSymptomForm.reset();
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", {
            timeOut: 1000,
          });
          this.isSymptom = false;
        }
      },
      (error) => {
        this.toastServ.error(error, "", {
          timeOut: 1000,
        });
      }
    );
  }

  addSideEffectData(data) {
    let dataToPass = {
      program_id: this.program_id,
      priority: data.priority,
      sideeffect: data.sideeffect,
    };
    this.commonServ.addSideEffect(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "", {
            timeOut: 1000,
          });
          this.getSideEffect();
          //this.isSymptom = false;

          this.addSideEffectForm.reset();
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", {
            timeOut: 1000,
          });
          this.isSymptom = false;
        }
      },
      (error) => {
        this.toastServ.error(error, "", {
          timeOut: 1000,
        });
      }
    );
  }

  getSymptoms() {
    let dataToPass = {
      program_id: this.program_id,
    };
    this.commonServ.getSymptom(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          debugger;
          // this.dataSource = data.data;
          this.symptomList = data.data;
          this.symptomLength = this.symptomList.length;
        } else if (data.code === 400) {
        }
      },
      (error) => {
        this.toastServ.error(error, "", {
          timeOut: 1000,
        });
      }
    );
  }

  getSideEffect() {
    let dataToPass = {
      program_id: this.program_id,
    };
    debugger;
    this.commonServ.getSideEffect(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          // this.dataSource = data.data;
          this.sideEffectList = data.data;
          this.sideEffectLength = this.sideEffectList.length;
        } else if (data.code === 400) {
        }
      },
      (error) => {
        this.toastServ.error(error, "", {
          timeOut: 1000,
        });
      }
    );
  }

  updateSymptomData(data) {
    let dataToPass = {
      symptom_id: this.symptom_id,
      symptom: data.symptom,
      priority: data.priority,
    };
    this.commonServ.updateSymptom(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "", {
            timeOut: 1000,
          });
          this.addSymptomForm.reset();
          this.getSymptoms();
          this.getPrograms();
          //this.isSymptom = false;
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", {
            timeOut: 1000,
          });
          this.isSymptom = false;
        }
      },
      (error) => {
        this.toastServ.error(error, "", {
          timeOut: 1000,
        });
      }
    );
  }
  updateSideEffectData(data) {
    let dataToPass = {
      sideeffect_id: this.sideeffect_id,
      sideeffect: data.sideeffect,
      priority: data.priority,
    };
    this.commonServ.updateSideEffect(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "", {
            timeOut: 1000,
          });
          this.addSideEffectForm.reset();
          this.getSideEffect();
          this.getPrograms();
          //this.isSymptom = false;
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", {
            timeOut: 1000,
          });
          this.isSideEffect = false;
        }
      },
      (error) => {
        this.toastServ.error(error, "", {
          timeOut: 1000,
        });
      }
    );
  }

  editSymptom(data) {
    this.symptom_id = data._id;
    this.isAddSymptom = true;
    this.addSymptomForm.get("symptom").setValue(data.symptom);
    this.prior = data.priority;
    this.addSymptomForm.get("priority").setValue(data.priority);
    this.isEditSymptom = true;
  }

  editSideEffect(data) {
    this.sideeffect_id = data._id;
    this.isAddSideEffect = true;
    this.addSideEffectForm.get("sideeffect").setValue(data.sideeffect);
    this.prior = data.priority;
    this.addSymptomForm.get("priority").setValue(data.priority);
    this.isEditSideEffect = true;
  }

  deleteSymptom(data) {
    let obj = {
      symptom_id: data._id,
      program_id: this.program_id,
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
          this.commonServ.deleteSymptom(obj).subscribe((data: any) => {
            if (data.code === 200) {
              swal.fire("Deleted!", "Your record has been deleted.", "success");
              this.getSymptoms();
            } else if (data.code === 400) {
              this.toastServ.error(data.message, "", {
                timeOut: 1000,
              });
            }
          });
        }
      });
  }
  deleteSideEffect(data) {
    let obj = {
      sideeffect_id: data._id,
      program_id: this.program_id,
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
          this.commonServ.deleteSideEffect(obj).subscribe((data: any) => {
            if (data.code === 200) {
              swal.fire("Deleted!", "Your record has been deleted.", "success");
              this.getSideEffect();
            } else if (data.code === 400) {
              this.toastServ.error(data.message, "", {
                timeOut: 1000,
              });
            }
          });
        }
      });
  }
}
