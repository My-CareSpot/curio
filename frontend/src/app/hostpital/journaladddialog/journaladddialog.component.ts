import { Component, OnInit } from "@angular/core";
// import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CommonService } from "src/app/common.service";
import { Router } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup } from "@angular/forms";
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material';

@Component({
  selector: 'app-journaladddialog',
  templateUrl: './journaladddialog.component.html',
  styleUrls: ['./journaladddialog.component.scss'],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
}]
})
export class JournaladddialogComponent implements OnInit {
  public assignmentName: String;
  public isError: boolean = false;
  userData: any;
  assignmentOption:any="Normal";
  normal:any;
  screening:any;

  constructor(
    private dialogRef: MatDialogRef<JournaladddialogComponent>,
    private cs: CommonService,
    private router: Router,
    private localServ: LocalService,
    private toastserv: ToastrService
  ) {}

  ngOnInit() {}
  keupFunc() {
    if (this.assignmentName == undefined || this.assignmentName == "") {
      this.isError = true;
    } else {
      this.isError = false;
    }
  }
  saveJournal() {
    if (this.assignmentName == undefined || this.assignmentName == "") {
      this.isError = true;
      return;
    }
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    let obj = {
      user_id: this.userData._id,
      assessment_type:this.assignmentOption,
      name: this.assignmentName,
    };
    this.cs.saveJournal(obj).subscribe((response: any) => {
      if (response.code == 200) {
        this.toastserv.success(response.message);
        this.close();
        this.router.navigate(["/dashboard/journal-list"]);
      } else {
        this.toastserv.error(response.message);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
