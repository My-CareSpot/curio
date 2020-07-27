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
  selector: 'app-journalpatient-question',
  templateUrl: './journalpatient-question.component.html',
  styleUrls: ['./journalpatient-question.component.scss']
})
export class JournalpatientQuestionComponent implements OnInit {

  dataSource: any;
  userData: any;
  user_id: any;
  defaultCount: any;
  journal_id: any;
  displayedColumns: string[] = [
    "Name",
    "QuestionType",
    "Option",
    "CreateAt"
  ];
  totaljournalPoint:any;
  displayedTotalColm:string[] = ["TotalPoint"];
  journalData;

  journalType: any;
  queryParamsString: any;
  totalPoint: any;

  constructor(
    public dialog: MatDialog,
    private commonServ: CommonService,
    private toastserv: ToastrService,
    private router: Router,
    private localServ: LocalService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.queryParamsString = this.activatedRoute.snapshot.params.id;
    this.journalData = JSON.parse(
      this.localServ.getJsonValue("journalId")
    );
    this.journalType = JSON.parse(
      this.localServ.getJsonValue("journalType")
    );
    this.user_id = this.userData._id;
    this.journal_id = this.journalData;
    if(this.journalType == "Screening"){
      this.totalPoint = JSON.parse(
        this.localServ.getJsonValue("totalPoint")
      );
    }
    this.getList();

  }
  goBack(){
    this.router.navigate( ['/dashboard/patient-journal-list', this.queryParamsString])
  }


  getList() {
    let obj = {
      user_id: this.queryParamsString,
      journal_id: this.journal_id,
    };
    this.commonServ.getAssignedJournalQuestionList(obj).subscribe((response: any) => {
      if (response.code == 200) {
        this.dataSource = response.data;
      }
    });
  }


}

