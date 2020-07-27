import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { CommonService } from "src/app/common.service";
import { LocalService } from "src/app/local.service";
import { ToastrService } from "ngx-toastr";
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialogConfig,
} from "@angular/material";
import { EditPatientassessmentDialogComponent } from '../edit-patientassessment-dialog/edit-patientassessment-dialog.component';
import { ObserveableService } from 'src/app/observeable.service';

@Component({
  selector: "app-assessment-patient",
  templateUrl: "./assessment-patient.component.html",
  styleUrls: ["./assessment-patient.component.scss"],
})
export class AssessmentPatientComponent implements OnInit {
  displayedColumns: string[] = ["patientName", "assessmentName", "Action"];
  dataSource = new MatTableDataSource<any[]>();
  
  patientList: any;
  assessmentList: any;
  assessementPatient: FormGroup;
  userData: any;
  user_id: String;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private commonService: CommonService,
    private localServ: LocalService,
    private toastserv: ToastrService,
    private observeServe : ObserveableService
  ) {}

  ngOnInit() {
    this.formBuilder();
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.searchPatient();
    this.allAssessment();
    this.showAssessmentMap();
  }

  formBuilder() {
    this.assessementPatient = this.fb.group({
      patientName: new FormControl("", [Validators.required]),
      assessmentId: new FormControl("", [Validators.required]),
    });
  }
  openDialogforAssignAssessment(element) {
    this.observeServe.changeMessage(element)
    const dialogRef = this.dialog.open(EditPatientassessmentDialogComponent, {
      width: "600px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.showAssessmentMap();     
    });
  }

  showAssessmentMap() {
    let obj = {
      hospital_id: this.user_id,
      isDeleted: false,
    };
    this.commonService.showAssessment(obj).subscribe((response: any) => {
      if (response.data) {
        this.dataSource = new MatTableDataSource(response.data);
      } else {
        this.toastserv.error(response.message, "", { timeOut: 1000 });
      }
    });
  }
  deletAssessmentRel(element){
    let data:any = {  
      inputData:{},    
      hospital_id: element.hospital_id,
    };
    data.inputData.patientName = [element.user_id];
    data.inputData.assessmentId = [];
    this.commonService
        .savePatientAssignment(data)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.toastserv.success("Assessment Deleted Successfully", "", {
              timeOut: 1000,
            });
            this.showAssessmentMap();
            
          } else {
            this.toastserv.error(response.message, "", {
              timeOut: 1000,
            });
          }
        });


  }

  saveAssessment() {
    if (this.assessementPatient.status != "INVALID") {
      let data = {
        inputData: this.assessementPatient.value,
        hospital_id: this.user_id,
      };

      this.commonService
        .savePatientAssignment(data)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.toastserv.success(response.message, "", {
              timeOut: 1000,
            });
            this.showAssessmentMap();
            this.assessementPatient.reset()
            
          } else {
            this.toastserv.error(response.message, "", {
              timeOut: 1000,
            });
          }
        });
    }
  }

  allAssessment() {
    let data = {
      cond: {
        isDeleted: false,
        user_id: this.user_id,
      },
    };
    this.commonService.getAssessmentList(data).subscribe((response: any) => {
      if (response.code == 200) {
        this.assessmentList = response.data.data;
      }
    });
  }

  searchPatient() {
    let data = {
      user_id: this.user_id,
      userType:this.userData.userType

    };
    this.commonService.getPatientList(data).subscribe((response: any) => {
      if (response.code == 200) {
        this.patientList = response.data;
      }
    });
  }
}
