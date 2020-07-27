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

@Component({
  selector: 'app-journal-qa-list',
  templateUrl: './journal-qa-list.component.html',
  styleUrls: ['./journal-qa-list.component.scss']
})
export class JournalQaListComponent implements OnInit {

  dataSource: any;
  userData: any;
  user_id: any;
  defaultCount: any;
  journal_id: any;
  // displayedColumns: string[] = [
  //   "Name",
  //   "QuestionType",
  //   "Option",
  //   "Points",
  //   "UpdatedAt",
  //   "Action",
  // ];
  displayedColumns: string[] = [
    "Name",
    "QuestionType",
    "Option",
    "UpdatedAt",
    "Image",
    "Action",
  ];
  journalData;

  public paginate: Number[] = [5, 10, 20, 50];
  public pagePerLimit: number = 5;
  public currentPage: number = 1;
  public indexPage: number = 0;
  public totalCount: number;
  journalType: any;

  constructor(
    public dialog: MatDialog,
    private commonServ: CommonService,
    private toastserv: ToastrService,
    private router: Router,
    private localServ: LocalService
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.journalData = JSON.parse(
      this.localServ.getJsonValue("journalId")
    );
    this.journalType = JSON.parse(
      this.localServ.getJsonValue("journalType")
    );
    this.user_id = this.userData._id;
    this.journal_id = this.journalData;

    this.getList();
  }
  paginatePage(event) {
    this.indexPage = event.pageIndex;
    this.currentPage = event.pageIndex + 1;
    this.pagePerLimit = event.pageSize;
    this.getList();
  }

  getList() {
    let obj = {
      user_id: this.user_id,
      journal_id: this.journal_id,
      action: "question",
      isDeleted: false,
      pageIndex: this.indexPage,
      pageSize: this.pagePerLimit,
    };
    this.commonServ.getJournalQuestionList(obj).subscribe((response: any) => {
      if (response.code == 200) {
        this.dataSource = response.data.data;
        this.totalCount = response.data.totalCount;
      }
    });
  }

  addNewQuestion() {
    this.router.navigate(["/dashboard/add-journal-question"]);
  }
  openEditPage(element) {
    let data = JSON.stringify(element);
    this.localServ.setJsonValue("question", data);
    this.router.navigate(["/dashboard/edit-journal-question"]);
  }

  deletQuestion(element, question) {
    let obj = {
      user_id: this.user_id,
      data: element._id,
      type: question,
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
}
