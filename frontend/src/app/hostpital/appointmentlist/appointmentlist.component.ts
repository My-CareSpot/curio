import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialogConfig,
} from "@angular/material";

import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { StorageService } from "src/app/storage.service";
import swal from "sweetalert2";
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
  selector: "app-appointmentlist",
  templateUrl: "./appointmentlist.component.html",
  styleUrls: ["./appointmentlist.component.scss"],
})
export class AppointmentlistComponent implements OnInit {
  userRoleId = 0;
  Visit: any;
  selectCareForm: FormGroup;
  length: any;
  userId = 0; // will be used service to get userd id which was saved after login $$..
  clientId: number = 0;
  patientsList: any[] = [];
  userData: any;
  careTeamList: any;
  user_id: any;
  mainPatientsList: any[] = [];
  displayedColumns: string[] = [
    "PatientName",
    "AppointmentDate",
    "StartAt",
    "EndAt",

    //'Pre-Visit', 'AppointmentDateVisit', 'Between', 'PCP',
    "Action",
  ];

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
    private localServ: LocalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;

    this.getcareTeamList();
    this.length = this.patientsList.length;
    this.selectCareForm = this.fb.group({
      user_id: ["", Validators.required],
    });

    this.selectCareForm.get("user_id").valueChanges.subscribe((data: any) => {
      console.log("datSa", data);
      this.getList(data);
    });
  }

  opendialog() {}

  getList(data) {
    let obj = {
      user_id: data,
    };
    this.commonServ.getAppointmentList(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.patientsList = data.data;

          this.mainPatientsList = this.patientsList;

          this.setTable();
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

  getcareTeamList() {
    let obj = {
      hospital_id: this.user_id,
    };
    this.commonServ.getHospitalCareTaker(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.careTeamList = data.data;
          console.log("PatientList", this.careTeamList);
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

  applyFilter(filterValue: any) {
    filterValue = filterValue.trimLeft();
    filterValue = filterValue.trim().toLowerCase();
    if (!filterValue || filterValue == "") {
      this.patientsList = this.mainPatientsList.map((s) => Object.assign(s));
      this.updateAfterSearchInList();
      // this.dataSource = this.patientsList;
    }
  }
  deleteAlert(data) {
    let obj = {
      user_id: data,
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
          this.commonServ.deletepatient(obj).subscribe((data: any) => {
            if (data.code === 200) {
              swal.fire("Deleted!", "Your record has been deleted.", "success");
            } else if (data.code === 400) {
              this.toastserv.error(data.message, "", {
                timeOut: 1000,
              });
            }
          });
        }
      });
  }
  consultationStart(data) {
    //console.log("DATA", data);
    this.commonServ.setAppointmentData(data);
    let dataToPass = {
      patient_user_id: data.patient_user_id,
      appointment_request_id: data.appointment_request_id,
    };
    this.commonServ
      .sendCallNotificationToPatient(dataToPass)
      .subscribe((data: any) => {
        if (data.code === 200) {
          console.log("notificationsent", data.message);
        } else if (data.code === 400) {
          console.error(data.message);
        }
      });
    sessionStorage.setItem("hexacode", JSON.stringify(data));
    this.router.navigate(["dashboard/consult"]);
  }
}
