import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { LocalService } from "src/app/local.service";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { ThrowStmt } from "@angular/compiler";
import { timeout } from "rxjs/operators";
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialogConfig,
} from "@angular/material";
@Component({
  selector: "app-sendmotivation",
  templateUrl: "./sendmotivation.component.html",
  styleUrls: ["./sendmotivation.component.scss"],
})
export class SendmotivationComponent implements OnInit {
  displayedColumns: string[] = [
    "title",
    "motivation",
    "assignedUser",
    "createdAt",
  ];
  dataSource = new MatTableDataSource<any[]>();
  toppings = new FormControl();
  patientList: any;
  motivationForm: FormGroup;
  userData: any;
  user_id: any;
  toppingList: string[] = [
    "Extra cheese",
    "Mushroom",
    "Onion",
    "Pepperoni",
    "Sausage",
    "Tomato",
  ];
  defaultCount: any;
  public paginate: Number[] = [5, 10, 20, 50];
  public pagePerLimit: number = 5;
  public currentPage: number = 1;
  public indexPage: number = 0;
  public totalCount: number;
  constructor(
    private localServ: LocalService,
    private commonServ: CommonService,
    private toastServ: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.getPatients();
    this.motivationForm = this.fb.group({
      title: ["", Validators.required],
      motivation: ["", Validators.required],
      patient_ids: ["", Validators.required],
    });
    this.getMotivationList();
  }

  getMotivationList() {
    let data = {
      hospital_id: this.user_id,
    };
    this.commonServ.getMotivationList(data).subscribe((response: any) => {
      if (response.code == 200) {
        this.dataSource = new MatTableDataSource(response.data);
      } else {
        this.toastServ.error(response.message, "", { timeOut: 1000 });
      }
    });
  }

  getPatients() {
    let dataToPass = {
      user_id: this.user_id,
    };

    this.commonServ.getPatientList(dataToPass).subscribe((data: any) => {
      this.patientList = data.data;
    });
  }

  submitMotivation(data) {
    let dataToPass = {
      motivation: data.motivation,
      title: data.title,
      patient_ids: data.patient_ids,
      user_id: this.user_id,
    };
    this.commonServ.sendMotivations(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.getMotivationList();
          // this.motivationForm.reset({title:'',motivation:'',patient_ids:""});
          // this.motivationForm.reset();
          this.toastServ.success("Motivation Sent", "", {
            timeOut: 1000,
          });
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", {
            timeOut: 1000,
          });
        }
      },
      (error) => {
        this.toastServ.error(error, "", {
          timeOut: 1000,
        });
      }
    );
  }
}
