import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { LocalService } from "src/app/local.service";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"],
})
export class SettingComponent implements OnInit {
  userData: any;
  user_id: any;
  settingForm: FormGroup;
  range: any = 1;
  ismorning: boolean;
  isafternoon: boolean;
  isevening: boolean;
  constructor(
    private fb: FormBuilder,
    private commonServ: CommonService,
    private toastServ: ToastrService,
    private localServ: LocalService
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    console.log(this.user_id);

    this.settingForm = this.fb.group({
      user_id: this.user_id,
      isMorning: [false, Validators.required],
      isEvening: [false],
      isAfternoon: [false],
      morningstarttime: [""],
      morningendtime: [""],
      afternoonstarttime: [""],
      afternoonendtime: [""],
      eveningstarttime: [""],
      eveningendtime: [""],
      range: ["", Validators.required],
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    this.settingForm.get("range").valueChanges.subscribe((data: any) => {
      this.range = data;
      console.log("Range", this.range);
    });
    this.settingForm.get("isMorning").valueChanges.subscribe((data: any) => {
      console.log("IsMorning", data);
      if (data === true) {
        this.ismorning = true;
        this.settingForm
          .get("morningstarttime")
          .setValidators([Validators.required]);
        this.settingForm.get("morningstarttime").updateValueAndValidity();
        this.settingForm
          .get("morningendtime")
          .setValidators([Validators.required]);
        this.settingForm.get("morningendtime").updateValueAndValidity();
      } else if (data === false) {
        this.ismorning = false;
        this.settingForm.get("morningstarttime").setValidators([]);
        this.settingForm.get("morningstarttime").updateValueAndValidity();
        this.settingForm.get("morningendtime").setValidators([]);
        this.settingForm.get("morningendtime").updateValueAndValidity();
      }
    });
    this.settingForm.get("isAfternoon").valueChanges.subscribe((data: any) => {
      console.log("isAfternoon", data);
      if (data === true) {
        this.isafternoon = true;
        this.settingForm
          .get("afternoonstarttime")
          .setValidators([Validators.required]);
        this.settingForm.get("afternoonstarttime").updateValueAndValidity();
        this.settingForm
          .get("afternoonendtime")
          .setValidators([Validators.required]);

        this.settingForm.get("afternoonendtime").updateValueAndValidity();
      } else if (data === false) {
        this.isafternoon = false;
        this.settingForm.get("afternoonstarttime").setValidators([]);
        this.settingForm.get("afternoonstarttime").updateValueAndValidity();
        this.settingForm.get("afternoonendtime").setValidators([]);
        this.settingForm.get("afternoonendtime").updateValueAndValidity();
      }
    });
    this.settingForm.get("isEvening").valueChanges.subscribe((data: any) => {
      console.log("isEvening", data);
      if (data === true) {
        this.isevening = true;
        this.settingForm
          .get("eveningstarttime")
          .setValidators([Validators.required]);
        this.settingForm.get("eveningstarttime").updateValueAndValidity();
        this.settingForm
          .get("eveningendtime")
          .setValidators([Validators.required]);
        this.settingForm.get("eveningendtime").updateValueAndValidity();
      } else if (data === false) {
        this.isevening = false;
        this.settingForm.get("eveningstarttime").setValidators([]);
        this.settingForm.get("eveningstarttime").updateValueAndValidity();
        this.settingForm.get("eveningendtime").setValidators([]);
        this.settingForm.get("eveningendtime").updateValueAndValidity();
      }
    });
  }

  saveTiming(data) {
    console.log("TABA", data);
    this.commonServ.setHospitalTiming(data).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "Time Set Done", {
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
