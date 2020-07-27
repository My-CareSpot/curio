import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { StorageService } from "src/app/storage.service";
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatSpinner,
} from "@angular/material";
import { RequestDialogueComponent } from "./request-dialogue/request-dialogue.component";

// import { DialogPatientComponent } from '../dialog-patient/dialog-patient.component';
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
  selector: "app-appointementrequest",
  templateUrl: "./appointementrequest.component.html",
  styleUrls: ["./appointementrequest.component.scss"],
})
export class AppointementrequestComponent implements OnInit {
  userRoleId = 0;
  Name: any;
  userData: any;
  isLoader: boolean = false;
  user_id: any;
  appointmentLength: any = 0;
  Visit: any;
  patientList: any;
  patientLength: any = 0;
  length: any;
  userId = 0; // will be used service to get userd id which was saved after login $$..
  clientId: number = 0;
  patientsList: any[] = [];
  mainPatientsList: any[] = [];
  displayedColumns: string[] = [
    "PatientName",
    "PatientPhoneNumber",
    "ProviderName",
    "ProviderPhoneNumber",
    "Proffesion",
    "Date",
    "Starttime",
    "Endtime",
    "sessionType",
    "action",
  ];

  // dataSource = this.patientsList;

  dataSource = new MatTableDataSource<any[]>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngAfterViewInit() {
    this.setTable();
  }

  updateAfterSearchInList() {
    this.paginator.pageIndex = 0;
    this.setTable();
  }

  setTable() {
    this.dataSource = new MatTableDataSource(this.patientsList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    public dialog: MatDialog,
    private commonServ: CommonService,
    private toastserv: ToastrService,
    private router: Router,
    private localServ: LocalService
  ) {}

  ngOnInit() {
    if (JSON.parse(sessionStorage.getItem("isReload")) === true) {
      this.isLoader = true;
      window.location.reload();
      sessionStorage.setItem("isReload", JSON.stringify(false));
    } else if (JSON.parse(sessionStorage.getItem("isReload")) === false) {
      this.isLoader = false;
    }
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.getAppointmentReqList();
    this.length = this.patientsList.length;
    this.getPatients();
  }

  getPatients() {
    let dataToPass = {
      user_id: this.user_id,
      userType:this.userData.userType
    };

    this.commonServ.getPatientList(dataToPass).subscribe((data: any) => {
      this.patientList = data.data;
      this.patientLength = this.patientList.length;
    });
  }

  getAppointmentReqList() {
    let obj = {
      user_id: this.user_id,
    };
    this.commonServ.getAppReqList(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.patientsList = data.data;
          console.log("THIS>PATIENT", this.patientsList);
          this.appointmentLength = data.data.length;

          if (this.appointmentLength === 0 || this.appointmentLength > 0) {
          } else {
            window.location.reload();
            this.ngOnInit();
          }

          this.mainPatientsList = this.patientsList;

          this.setTable();
        } else if (data.code === 400) {
          this.toastserv.success("Loading Data...", "", {
            timeOut: 1000,
          });
        }
      },
      (error) => {
        //console.log(error)
        // this.toastserv.success("Loading Data...", "", {
        //   timeOut: 1000,
        // });
      }
    );
  }

  applyFilter(filterValue: any) {
    filterValue = filterValue.trimLeft();
    filterValue = filterValue.trim().toLowerCase();
    if (!filterValue || filterValue == "") {
      this.patientsList = this.mainPatientsList.map((s) => Object.assign(s));
      this.updateAfterSearchInList();
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

  openDialog(data) {
    console.log("DATA", data);
    const dialogRef = this.dialog.open(RequestDialogueComponent, {
      width: "500px",
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAppointmentReqList();
        this.getPatients();

        // show success message $$..
      }
    });
  }
}
