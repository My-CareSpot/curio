



import { Component, OnInit, ViewChild ,Inject } from '@angular/core';

import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { StorageService } from "src/app/storage.service";


export function filterListBySearchStringOnDisplayedColumns(searchString: string, targetList: any[], targetColumns: string[]) {
  let searchedList: any[] = [];
  let _targetList: any[] = targetList.map(s => Object.assign({}, s));
  for (var i = 0; i < _targetList.length; i++) {
    for (var j = 0; j < targetColumns.length; j++) {
      let obj = _targetList[i];
      let column = targetColumns[j];
      let val = obj[column];
      let value = val ? val.toString().toLowerCase() : '';
      let found = value.includes(searchString);
      if (found) {
        searchedList.push(_targetList[i]);
        break;
      }
    }
  }
  return searchedList;
}
@Component({
  selector: 'app-assigned-caretaker',
  templateUrl: './assigned-caretaker.component.html',
  styleUrls: ['./assigned-caretaker.component.scss']
})


export class AssignedCaretakerComponent implements OnInit {
  
  isSelected:any;
  masterSelected:boolean;
  checklist:any;
  checklist1:any;
  checkedList:any;
   checkedList1:any;
  hospital_id:any;
  userRoleId = 0;
  Visit:any;
  patient_id:any;
  careTakerList:any[]=[]
  length:any;
  userData:any;
  tempCareList:any;
  user_id:any;
  userId = 0; // will be used service to get userd id which was saved after login $$..
  clientId: number = 0;
  patientsList: any[] = [];
  list:any[]=[];
  arrayList:any=[];
  mainPatientsList: any[] = [];
  displayedColumns: string[] = ['Select','Name', 'DM', 'HT', 'Next_Contact'
 ];

  // dataSource = this.patientsList;

  dataSource = new MatTableDataSource<any[]>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngAfterViewInit() {
    this.setTable();
  }

  updateAfterSearchInList() {
    this.paginator.pageIndex = 0;
    this.setTable();
  }

  setTable() {
    this.dataSource = new MatTableDataSource( this.mainPatientsList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    public dialog: MatDialog,
    private commonServ: CommonService,
    private toastserv: ToastrService,
    private router: Router,
    private localServ: LocalService,
    private dialogRef: MatDialogRef<AssignedCaretakerComponent>,
    @Inject(MAT_DIALOG_DATA) data

  ) {
    this.hospital_id = data.data.hospital_id;
    this.patient_id = data.data.user_id;
  }

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.getList();
    this.length=this.patientsList.length

  }

  getList() {
    let obj={
      "user_id":this.patient_id
    }
    this.commonServ.viewCaretakerList(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.patientsList=data.data
       
          let careTList = [];
          this.careTakerList = data.data;
        
          this.careTakerList.forEach(element => {
        
            careTList.push({
              caretaker_id: element.caretaker_id,
              caredata: element.user
            });
          });
          this.tempCareList = careTList
          this.mainPatientsList = this.checkedList
          this.setTable();
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




applyFilter(filterValue: any) {
  filterValue = filterValue.trimLeft();
  filterValue = filterValue.trim().toLowerCase();
  if (!filterValue || filterValue == "") {
    this.patientsList = this.mainPatientsList.map(s => Object.assign(s));
    this.updateAfterSearchInList();
  }
  else {
    let targetColumns = ['patientId', 'name', 'age', 'location'];
    this.patientsList = filterListBySearchStringOnDisplayedColumns(filterValue, this.mainPatientsList, targetColumns).map(s => Object.assign(s));
    this.updateAfterSearchInList();
  }
}



close() {
  this.dialogRef.close();
}
inputChecked(i: any, data: any) {
  let checked = false;
  for (let i = 0; i < this.arrayList.length; i++) {
    let temp = this.arrayList[i];
    if (temp.id == data._id) {
      checked = true;
    }
  }
  return checked;
}



}

