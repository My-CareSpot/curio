import { Component, OnInit, ViewChild } from "@angular/core";

import {
  MatDialog,
  MatTableDataSource,
  MatSlider,
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
import { SuperadminService } from '../superadmin.service';

@Component({
  selector: 'app-subadmin',
  templateUrl: './subadmin.component.html',
  styleUrls: ['./subadmin.component.scss']
})
export class SubadminComponent implements OnInit {

  userRoleId = 0;
  Visit: any;
  length: any;
  userId = 0; // will be used service to get userd id which was saved after login $$..
  clientId: number = 0;
  hospitalList: any[] = [];
  userData: any;
  isChecked: boolean;
  user_id: any;
  mainhospitalList: any[] = [];
  displayedColumns: string[] = [
    "Hospital",
    "Email",
    "Contact",
    "Status",
    "Action",
  ];
  protected userType;

  // dataSource = this.hospitalList;

  dataSource = new MatTableDataSource<any[]>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngAfterViewInit() {
    // this.setTable();
  }

  // updateAfterSearchInList() {
  //   this.paginator.pageIndex = 0;
  //   this.setTable();
  // }

  setTable() {
    this.dataSource = new MatTableDataSource(this.hospitalList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    public dialog: MatDialog,
    private superadminservice: SuperadminService,
    private toastserv: ToastrService,
    private router: Router,
    private localServ: LocalService
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.userType = this.localServ.getJsonValue("userType");
    this.getList();
  }

  getList() {
    let obj = {
      hospitalId: this.user_id,
      userType:"subadmin"
    };
    this.superadminservice.getHospitalList(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.hospitalList = data.data;

          this.mainhospitalList = this.hospitalList;

          this.setTable();
        } else if (data.code === 400) {
          this.toastserv.error("No Data Found", "", {
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

  registerPatient() {
    this.router.navigate(["admin/dashboard/add-sub-admin"]);
  }
  
  deletehospital(data) {
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
          this.superadminservice.deletehospital(obj).subscribe((data: any) => {
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

}


