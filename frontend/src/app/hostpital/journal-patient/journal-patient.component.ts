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
import { EditPatientjournalDialogComponent } from '../edit-patientjournal-dialog/edit-patientjournal-dialog.component';
import { ObserveableService } from 'src/app/observeable.service';

@Component({
  selector: 'app-journal-patient',
  templateUrl: './journal-patient.component.html',
  styleUrls: ['./journal-patient.component.scss']
})
export class JournalPatientComponent implements OnInit {
  displayedColumns: string[] = ["patientName", "journalName", "Action"];
  dataSource = new MatTableDataSource<any[]>();
  
  patientList: any;
  journalList: any;
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
    this.alljournal();
    this.showjournalMap();
  }

  formBuilder() {
    this.assessementPatient = this.fb.group({
      patientName: new FormControl("", [Validators.required]),
      journalId: new FormControl("", [Validators.required]),
    });
  }
  openDialogforAssignjournal(element) {
    this.observeServe.changeMessage1(element)
    const dialogRef = this.dialog.open(EditPatientjournalDialogComponent, {
      width: "600px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.showjournalMap();     
    });
  }

  showjournalMap() {
    let obj = {
      hospital_id: this.user_id,
      isDeleted: false,
    };
    this.commonService.showjournal(obj).subscribe((response: any) => {
      if (response.data) {
        this.dataSource = new MatTableDataSource(response.data);
      } else {
        this.toastserv.error(response.message, "", { timeOut: 1000 });
      }
    });
  }
  deletjournalRel(element){
    let data:any = {  
      inputData:{},    
      hospital_id: element.hospital_id,
    };
    data.inputData.patientName = [element.user_id];
    data.inputData.journalId = [];
    this.commonService
        .savePatientJournal(data)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.toastserv.success("journal Deleted Successfully", "", {
              timeOut: 1000,
            });
            this.showjournalMap();
            
          } else {
            this.toastserv.error(response.message, "", {
              timeOut: 1000,
            });
          }
        });


  }

  savejournal() {
    if (this.assessementPatient.status != "INVALID") {
      let data = {
        inputData: this.assessementPatient.value,
        hospital_id: this.user_id,
      };

      this.commonService
        .savePatientJournal(data)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.toastserv.success(response.message, "", {
              timeOut: 1000,
            });
            this.showjournalMap();
            this.assessementPatient.reset()
            
          } else {
            this.toastserv.error(response.message, "", {
              timeOut: 1000,
            });
          }
        });
    }
  }

  alljournal() {
    let data = {
      cond: {
        isDeleted: false,
        user_id: this.user_id,
      },
    };
    this.commonService.getJournalList(data).subscribe((response: any) => {
      if (response.code == 200) {
        this.journalList = response.data.data;
      }
    });
  }

  searchPatient() {
    let data = {
      user_id: this.user_id,
    };
    this.commonService.getPatientList(data).subscribe((response: any) => {
      if (response.code == 200) {
        this.patientList = response.data;
      }
    });
  }
}

