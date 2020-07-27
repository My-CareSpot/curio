

import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { countries } from "./../../country";

@Component({
  selector: 'app-editpatientdialog',
  templateUrl: './editpatientdialog.component.html',
  styleUrls: ['./editpatientdialog.component.scss']
})
export class EditpatientdialogComponent implements OnInit {
  isLive = [
    { value: true, name: "Yes" },
    { value: false, name: "No" }
    
  ];
  genderList = [
    { value: "male", name: "Male" },
    { value: "female", name: "Female" }
  ];

  patientId:any;
  countries: any;

    user_id:any;
    userData:any;
    form: FormGroup;
    description:string;
    list  :any;
    data:any;
    startdate:any;
    enddate:any;
    datetime:any;
    queryParamsString:any;
    startDate=new Date();
    constructor(
        private fb: FormBuilder,
        private commonServ: CommonService,
        private toastserv: ToastrService,
        private router:Router,
        private activatedRoute: ActivatedRoute,
        private localServ: LocalService,
        private dialogRef: MatDialogRef<EditpatientdialogComponent>,
         @Inject(MAT_DIALOG_DATA) data
     ) {
        this.data=data.data
      
        this.form = fb.group({
        
          firstName: ['', Validators.required],
          middleName:['', Validators.required],
          lastName: ['', Validators.required],
          // gender: ['', Validators.required],
          phoneNumber: ['', Validators.required],
          // islive:['', Validators.required],
          phonecountry:['',Validators.required]
        });
        this.countries = countries;
        this.patchvalues()
    }

    ngOnInit() {
     
      this.queryParamsString = this.activatedRoute.snapshot.params.id;
      this.userData = JSON.parse(this.localServ.getJsonValue("user"));
      this.user_id = this.userData._id;
     

    }
    patchvalues(){
      this.form.patchValue({
        firstName: this.data.firstName,
        middleName: this.data.middleName,
        lastName: this.data.lastName,
        // gender: this.data.gender,
        phoneNumber: this.data.phoneNumber,
        // islive: this.data.islive,
        phonecountry:this.data.phonecountry
      });
    }

  
    save() {
      this.commonServ.updatePatient(this.form.value,this.data.user_id).subscribe(
        (data: any) => {
          if (data.code === 200) {
            this.toastserv.success(data.message, "", {
              timeOut: 1000
            });
            this.dialogRef.close(this.form.value);
           
          } else if (data.code === 400) {
            this.toastserv.error(data.message, "", {
              timeOut: 1000
            });
          }
        },
        error => {
          this.toastserv.error(error.error, "", {
            timeOut: 1000
          });
        }
      );
      
    }

    close() {
        this.dialogRef.close();
    }

}


