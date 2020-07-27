import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";


@Component({
  selector: 'app-add-record-dialog',
  templateUrl: './add-record-dialog.component.html',
  styleUrls: ['./add-record-dialog.component.scss']
})
export class AddRecordDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AddRecordDialogComponent>
    ){}
 

  ngOnInit() {
  }
  
  save(){
    
  }
  
  close() {
    this.dialogRef.close();
  }

}
