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
import { JournaladddialogComponent } from '../journaladddialog/journaladddialog.component';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.scss']
})
export class JournalListComponent implements OnInit {
  displayedColumns: string[] = ["Name","AssessementType", "CreateAt", "Action"];
  defaultCount: any;
  userData: any;
  user_id: String;
  journalList: any[] = [];
  mainJournalList: any[] = [];
  public paginate: Number[] = [5, 10, 20, 50];
  public pagePerLimit: number = 5;
  public currentPage: number = 1;
  public indexPage: number = 0;
  public totalCount: number;

  dataSource = new MatTableDataSource<any[]>();
  // @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: false }) sort: MatSort;

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
    // this.length = this.journalList.length;
  }
  

  paginatePage(event) {
    this.indexPage = event.pageIndex;
    this.currentPage = event.pageIndex + 1;
    this.pagePerLimit = event.pageSize;
    this.getList();
  }

  deletjournalRel(data, type) {
    let obj = {
      user_id: this.user_id,
      data: data._id,
      type: type,
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
          this.commonServ.deletejournal(obj).subscribe((data: any) => {
            if (data.code === 200) {
              this.getList();
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
  // searchContent(event){
  //   this.isSearching = true;
  //   this.searchChar = event.target.value;
  //   this.getUserList();

  // }

  getList() {
    let obj = {
      user_id: this.user_id,
      paginate: {
        pageIndex: this.indexPage,
        pageSize: this.pagePerLimit,
      },
      msgStatus: null,

      cond: {
        isDeleted: false,
        user_id: this.user_id,
      },
    };
    this.commonServ.getJournalList(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.journalList = data.data["data"];
          this.totalCount = data.data.totalCount;

          this.mainJournalList = this.journalList;

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

  openDialogforAssignjournal() {
    const dialogRef = this.dialog.open(JournaladddialogComponent, {
      width: "600px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getList();
      if (result) {
        // show success message $$..
      }
    });
  }

  openjournalPage(element) {
    let data = JSON.stringify(element._id);
    this.localServ.setJsonValue("journalId", data);
    this.localServ.setJsonValue("journalType",JSON.stringify(element.journal_type))
    this.router.navigate(["/dashboard/get-journalQuestionInfo"]);
  }
}
