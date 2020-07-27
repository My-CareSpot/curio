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
import { AssignmentadddialogComponent } from "../assignmentadddialog/assignmentadddialog.component";
@Component({
  selector: 'app-journalpatient-list',
  templateUrl: './journalpatient-list.component.html',
  styleUrls: ['./journalpatient-list.component.scss']
})
export class JournalpatientListComponent implements OnInit {
  // displayedColumns: string[] = ["Name","AssessementType","Status","AssessmentPoint", "Action"];
  displayedColumns: string[] = ["Name","AssessementType","Status", "Action"];

  defaultCount: any;
  userData: any;
  user_id: String;
  journalList: any[] = [];
  mainjournalList: any[] = [];
  // public paginate: Number[] = [5, 10, 20, 50];
  // public pagePerLimit: number = 5;
  // public currentPage: number = 1;
  // public indexPage: number = 0;
  // public totalCount: number;
  queryParamsString;

  dataSource = new MatTableDataSource<any[]>();
  // @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private commonServ: CommonService,
    private toastserv: ToastrService,
    private router: Router,
    private localServ: LocalService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.queryParamsString = this.activatedRoute.snapshot.params.id;

    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.getList();
    // this.length = this.journalList.length;
  }
  

  // paginatePage(event) {
  //   this.indexPage = event.pageIndex;
  //   this.currentPage = event.pageIndex + 1;
  //   this.pagePerLimit = event.pageSize;
  //   this.getList();
  // }

  // deletjournalRel(data, type) {
  //   let obj = {
  //     user_id: this.user_id,
  //     data: data._id,
  //     type: type,
  //   };

  //   swal
  //     .fire({
  //       title: "Are you sure?",
  //       text: "You want to delete!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it!",
  //     })
  //     .then((result) => {
  //       if (result.value) {
  //         this.commonServ.deletejournal(obj).subscribe((data: any) => {
  //           if (data.code === 200) {
  //             this.getList();
  //             swal.fire("Deleted!", "Your record has been deleted.", "success");
  //           } else if (data.code === 400) {
  //             this.toastserv.error(data.message, "", {
  //               timeOut: 1000,
  //             });
  //           }
  //         });
  //       }
  //     });
  // }
  // searchContent(event){
  //   this.isSearching = true;
  //   this.searchChar = event.target.value;
  //   this.getUserList();

  // }

  getList() {
    let obj = {
      user_id: this.queryParamsString,
      isDeleted:true
      // paginate: {
      //   pageIndex: this.indexPage,
      //   pageSize: this.pagePerLimit,
      // },

     
    };
    this.commonServ.getAssignedJournalList(obj).subscribe(
      (data: any) => {
        console.log(data)
        if (data.code === 200) {
          this.journalList = data.data;
        //   // this.totalCount = data.data.totalCount;

        //   this.mainjournalList = this.journalList;

          this.setTable();
        // } else if (data.code === 400) {
        //   this.toastserv.error(data.message, "", {
        //     timeOut: 1000,
        //   });
        }
      },
      (error) => {
        this.toastserv.error(error.error, "", {
          timeOut: 1000,
        });
      }
    );
  }

  openDialog() {
    this.router.navigate(["dashboard/survey-add"]);
  }
  ngAfterViewInit() {
    this.setTable();
  }

  setTable() {
    this.dataSource = new MatTableDataSource(this.journalList);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  openjournalPage(element) {
    if(element.status=="completed"){
      if(element.journal_type == "Screening"){
        let totalPoint = 0;
        totalPoint = element.totalCount;
        this.localServ.setJsonValue("totalPoint", totalPoint);
      }
    let data = JSON.stringify(element.journalId);
    this.localServ.setJsonValue("journalId", data);
    // this.localServ.setJsonValue("journalType", element.journal_type);
    this.localServ.setJsonValue("journalType",JSON.stringify(element.journal_type))
    this.router.navigate(['/dashboard/patient-journal-question', this.queryParamsString]);}
  }
}
