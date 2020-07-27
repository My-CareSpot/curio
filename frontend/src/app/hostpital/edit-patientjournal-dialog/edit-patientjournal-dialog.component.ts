import { Component, OnInit } from '@angular/core';
import { ObserveableService } from 'src/app/observeable.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common.service';
import { LocalService } from 'src/app/local.service';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-patientjournal-dialog',
  templateUrl: './edit-patientjournal-dialog.component.html',
  styleUrls: ['./edit-patientjournal-dialog.component.scss']
})
export class EditPatientjournalDialogComponent implements OnInit {

  journalPatient: FormGroup;
  binding:any;
  patientId:String;
  patientName:String;
  journalList:any=[];
  journalSelected:any;
  hospitalId:any;
  userId:any;
  userData:any;
  user_id:any;
  journalselect:any;

  constructor(
    private dialogRef: MatDialogRef<EditPatientjournalDialogComponent>,
    private observeServe : ObserveableService,
    private fb: FormBuilder,
    private commonService:CommonService,
    private localServ: LocalService,
    private toastserv: ToastrService,
    private router : Router
  ) { }

  ngOnInit() { 
    this.observeServe.dataJournal.subscribe((response:any)=>{
      this.patientName = response.full_name;
      this.hospitalId = response.hospital_id;
      this.patientId = response._id;
      this.userId = response.user_id;
      this.journalSelected = response.journal_info;
      this.journalselect = response.journal_id
    })
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.formBuilder();
    this.alljournal();
  }  

  alljournal() {
    let data = {
      cond: {
        isDeleted: false,
        user_id: this.user_id,
      },
    };
    this.commonService.getJournalList(data).subscribe((response: any) => {
      if (response.code == 200) {
        this.journalList = response.data.data;
      }
    });
  }

  formBuilder() {
    this.journalPatient = this.fb.group({
      patientName: new FormControl({ value: "", disabled: true }, [Validators.required]),
      journalId: new FormControl("", [Validators.required]),
    });
    this.journalPatient.get("patientName").patchValue(this.patientName);
    this.journalPatient.get("journalId").patchValue(this.journalselect)
  }

  close() {
    this.dialogRef.close();
  }

  savejournal() {
    if (this.journalPatient.status != "INVALID") {
      let data = {
        inputData: this.journalPatient.value,
        hospital_id: this.user_id,
      };
      data.inputData.patientName = [this.userId]
     

      this.commonService
        .savePatientJournal(data)
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
