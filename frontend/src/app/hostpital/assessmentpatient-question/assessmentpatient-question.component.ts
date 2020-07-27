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
  selector: 'app-assessmentpatient-question',
  templateUrl: './assessmentpatient-question.component.html',
  styleUrls: ['./assessmentpatient-question.component.scss']
})
export class AssessmentpatientQuestionComponent implements OnInit {
  dataSource: any;
  userData: any;
  user_id: any;
  defaultCount: any;
  assessment_id: any;
  displayedColumns: string[] = [
    "Name",
    "QuestionType",
    "Option",
    "CreateAt"
  ];
  totalAssessmentPoint:any;
  displayedTotalColm:string[] = ["TotalPoint"];
  assessmentData;

  assessmentType: any;
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
    this.assessmentData = JSON.parse(
      this.localServ.getJsonValue("assessmentId")
    );
    this.assessmentType = JSON.parse(
      this.localServ.getJsonValue("assessmentType")
    );
    this.user_id = this.userData._id;
    this.assessment_id = this.assessmentData;
    if(this.assessmentType == "Screening"){
      this.totalPoint = JSON.parse(
        this.localServ.getJsonValue("totalPoint")
      );
    }
    this.getList();

  }
  goBack(){
    this.router.navigate( ['/dashboard/patient-assessment-list', this.queryParamsString])
  }


  getList() {
    let obj = {
      user_id: this.queryParamsString,
      assessment_id: this.assessment_id,
    };
    this.commonServ.getAssignedQuestionList(obj).subscribe((response: any) => {
      if (response.code == 200) {
        this.dataSource = response.data;
      }
    });
  }


}
