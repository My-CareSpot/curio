import { Component, OnInit } from '@angular/core';
import { ObserveableService } from 'src/app/observeable.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common.service';
import { LocalService } from 'src/app/local.service';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-patientassessment-dialog',
  templateUrl: './edit-patientassessment-dialog.component.html',
  styleUrls: ['./edit-patientassessment-dialog.component.scss']
})
export class EditPatientassessmentDialogComponent implements OnInit {
  assessementPatient: FormGroup;
  binding:any;
  patientId:String;
  patientName:String;
  assessmentList:any=[];
  assessmentSelected:any;
  hospitalId:any;
  userId:any;
  userData:any;
  user_id:any;
  assessmentselect:any;

  constructor(
    private dialogRef: MatDialogRef<EditPatientassessmentDialogComponent>,
    private observeServe : ObserveableService,
    private fb: FormBuilder,
    private commonService:CommonService,
    private localServ: LocalService,
    private toastserv: ToastrService,
    private router : Router
  ) { }

  ngOnInit() {    
    this.observeServe.data.subscribe((response:any)=>{
      this.patientName = response.full_name;
      this.hospitalId = response.hospital_id;
      this.patientId = response._id;
      this.userId = response.user_id;
      this.assessmentSelected = response.assessment_info;
      this.assessmentselect = response.assessment_id
    })
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.formBuilder();
    this.allAssessment();
  }  

  allAssessment() {
    let data = {
      cond: {
        isDeleted: false,
        user_id: this.user_id,
      },
    };
    this.commonService.getAssessmentList(data).subscribe((response: any) => {
      if (response.code == 200) {
        this.assessmentList = response.data.data;
      }
    });
  }

  formBuilder() {
    this.assessementPatient = this.fb.group({
      patientName: new FormControl({ value: "", disabled: true }, [Validators.required]),
      assessmentId: new FormControl("", [Validators.required]),
    });
    this.assessementPatient.get("patientName").patchValue(this.patientName);
    this.assessementPatient.get("assessmentId").patchValue(this.assessmentselect)
  }

  close() {
    this.dialogRef.close();
  }

  saveAssessment() {
    if (this.assessementPatient.status != "INVALID") {
      let data = {
        inputData: this.assessementPatient.value,
        hospital_id: this.user_id,
      };
      data.inputData.patientName = [this.userId]
     

      this.commonService
        .savePatientAssignment(data)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.toastserv.success(response.message, "", {
              timeOut: 1000,
            });
            this.dialogRef.close();
            
          } else {
            this.toastserv.error(response.message, "", {
              timeOut: 1000,
            });
          }
        });
    }
  }

}
