import { Component, OnInit, ViewChild } from "@angular/core";

import {
  MatDialog,
  MatTableDataSource,
  MatSlider,
  MatSort,
  MatPaginator,
  MatDialogConfig,
} from "@angular/material";

import { DialogComponent } from "../../dialog/dialog.component";
import { AssignpatientdialogComponent } from "../../assignpatientdialog/assignpatientdialog.component";
import { EditpatientdialogComponent } from "../../editpatientdialog/editpatientdialog.component";
import { AssignedCaretakerComponent } from "../../assigned-caretaker/assigned-caretaker.component";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { StorageService } from "src/app/storage.service";
import swal from "sweetalert2";

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
  selector: "app-patient-list",
  templateUrl: "./patient-list.component.html",
  styleUrls: ["./patient-list.component.scss"],
})
export class PatientListComponent implements OnInit {
  userRoleId = 0;
  Visit: any;
  length: any;
  userId = 0; // will be used service to get userd id which was saved after login $$..
  clientId: number = 0;
  patientsList: any[] = [];
  userData: any;
  isChecked: boolean;
  user_id: any;
  mainPatientsList: any[] = [];
  displayedColumns: string[] = [
    "Name",
    "DM",
    "HT",
    "CAD",
    "Next_Contact",
    "notification",
    "Status",
    //'Pre-Visit', 'Visit', 'Between', 'PCP',
    "Action",
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
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.getList();
    this.length = this.patientsList.length;
  }

  getList() {
    let obj = {
      user_id: this.user_id,
      userType:this.userData.userType
    };
    this.commonServ.getPatientList(obj).subscribe(
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
  openEditCaretaker(type: string, data: any) {
    const dialogRef = this.dialog.open(EditpatientdialogComponent, {
      width: "500px",
      data: {
        type: type,
        data: data,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getList();
        // show success message $$..
      }
    });
  }

  registerPatient() {
    this.router.navigate(["dashboard/add-patient"]);
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DialogComponent, {
      width: "600px",
      data: {
        // type: type,
        // data: data
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // show success message $$..
      }
    });
  }
  openDialogforAssignPatient(type: string, data: any) {
    const dialogRef = this.dialog.open(AssignpatientdialogComponent, {
      width: "600px",
      data: {
        type: type,
        data: data,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getList();
        // show success message $$..
      }
    });
  }
  openDialogforViewAssignCaretaker(type: string, data: any) {
    const dialogRef = this.dialog.open(AssignedCaretakerComponent, {
      width: "800px",
      data: {
        type: type,
        data: data,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // show success message $$..
      }
    });
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
              this.getList();
            } else if (data.code === 400) {
              this.toastserv.error(data.message, "", {
                timeOut: 1000,
              });
            }
          });
        }
      });
  }

  changeModel(event, data) {
    console.log("EVENT", event, data);

    let dataToPass = {
      user_id: data.user_id,
      isNotificationAble: event,
    };
    this.commonServ.notificationSetting(dataToPass).subscribe((data: any) => {
      if (data.code === 200) {
        this.toastserv.success(data.message, "", {
          timeOut: 1000,
        });
        this.getList();
      } else if (data.code === 400) {
        this.toastserv.error(data.message, "", {
          timeOut: 1000,
        });
      }
    });
  }
}
