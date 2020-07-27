import { Component, OnInit, ViewChild, Inject } from "@angular/core";

import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator,
} from "@angular/material";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { EditCaretakerdialogComponent } from "../../edit-caretakerdialog/edit-caretakerdialog.component";
import swal from "sweetalert2";
@Component({
  selector: "app-care-team",
  templateUrl: "./care-team.component.html",
  styleUrls: ["./care-team.component.scss"],
})
export class CareTeamComponent implements OnInit {
  hospital_id: any;
  userRoleId = 0;
  patient_id: any;
  userData: any;
  user_id: any;
  patientsList: any[] = [];
  list: any[] = [];
  arrayList: any = [];
  mainPatientsList: any[] = [];
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
    this.getcareTeamList();
  }
  openEditCaretaker(type: string, data: any) {
    const dialogRef = this.dialog.open(EditCaretakerdialogComponent, {
      width: "500px",
      data: {
        type: type,
        data: data,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getcareTeamList();
        // show success message $$..
      }
    });
  }
  getcareTeamList() {
    let obj = {
      hospital_id: this.user_id,
    };
    this.commonServ.getHospitalCareTaker(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.patientsList = data.data;
          console.log("PatientList", this.patientsList);
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
          this.commonServ.deleteCaretaker(obj).subscribe((data: any) => {
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
}
