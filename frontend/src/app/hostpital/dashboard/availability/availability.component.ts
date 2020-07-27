import {
  Component,
  ChangeDetectionStrategy,
  TemplateRef,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";

// import { EditProfileService } from '../../profile/service/edit-profile.service';
import * as underscore from "underscore";
import { ToastrService, ToastRef } from "ngx-toastr";
import * as moment from "moment-timezone";

// import { SharedService } from '../../../shared.service';
// import { dataFor } from 'knockout';
import { IfStmt } from "@angular/compiler";

@Component({
  selector: "app-set-availability",
  templateUrl: "./availability.component.html",
  styleUrls: ["./availability.component.scss"],
})
export class AvailabilityComponent implements OnInit {
  breakTime: FormArray;
  breakTimeArray: any = [];
  error: any = { isError: false, errorMessage: "" };
  btnMode: string = "Create";
  setHeadMode: string = "Create Availability";
  availabilityDisplay: boolean = false;
  addAvailabilityForm: FormGroup;
  availabilitFilterForm: FormGroup;

  loggedInUserDetails: any = "";
  loggedInUserDetailsData: any = "";

  pageCountLink: any;
  isAvailabilityLoading: boolean = false;
  createAvvailAccessStatus: boolean = false;
  editAvailablityID: any;
  deleteAvailablityID: any;

  startDate: Date;
  endDate: Date;
  currentDate: Date = new Date();
  startTime: Date = new Date(
    this.currentDate.getFullYear(),
    this.currentDate.getMonth() + 1,
    this.currentDate.getDate(),
    0,
    0,
    0,
    0
  );
  endTime: Date = new Date(
    this.currentDate.getFullYear(),
    this.currentDate.getMonth() + 1,
    this.currentDate.getDate(),
    0,
    0,
    0,
    0
  );
  timeZoneVal: any;
  timeZoneOffset: any;
  availabilityListData: any = [];
  individualAvailData: any;
  displayDelete: boolean = false;
  everyDay: boolean = false;

  breakTmDuration: any;
  breakTmValue: Date = new Date();
  timevalue1: Date = new Date();
  timevalue2: Date = new Date();
  timevalue3: Date = new Date();
  breakTmInitialValue: Date;
  invalidDates: Array<Date>;
  filterGetStaffList: any;
  minimumDate: Date;
  minimumStartDate: Date;
  maximumStartDate: Date;
  breakTimeBoolean: boolean = true;
  breakEndTimeBoolean: boolean = true;

  showDuration: boolean = false;
  showBreakFields: boolean = false;
  avilabilitytotalCount: any;

  checkAccess = {
    business: false,
    staff: false,
  };
  staffData: { label: string; value: any }[];
  availability_duration_time: { label: string; value: string }[];
  Availabilitypage: any;
  Aavilabilitycount: any;

  constructor(
    private formBuilder: FormBuilder,

    private toastr: ToastrService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.availability_duration_time = [
      { label: "Select Appointment Duration", value: null },
      { label: "15 min", value: "15" },
      { label: "30 min", value: "30" },
      { label: "45 min", value: "45" },
      { label: "60 min", value: "60" },
      { label: "75 min", value: "75" },
      { label: "90 min", value: "90" },
      { label: "105 min", value: "105" },
      { label: "120 min", value: "120" },
    ];

    this.addAvailabilityForm = this.formBuilder.group({
      avialability_name: ["", [Validators.required]],
      staff: ["", Validators.compose([Validators.required])],
      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],
      startTime: [new Date(), Validators.compose([Validators.required])],
      endTime: [new Date(), Validators.compose([Validators.required])],
      availability_duration: ["", [Validators.required]],
      breakTime: this.formBuilder.array([]),
      week: this.formBuilder.group({
        sun: [false],
        mon: [false],
        tue: [false],
        wed: [false],
        thur: [false],
        fri: [false],
        sat: [false],
      }),
    });

    //Business Login

    //Staff login

    this.availabilitFilterForm = this.formBuilder.group({
      business_id: [""],
      staff_id: [""],
    });

    // this.getClinicLocation();
    this.getStaffListDetails();
    this.getBusinessList();
    // this.getStaffClinicAssociatedLoaction();
    this.getAvailabilities();
  }

  currentTime1() {
    this.timevalue1 = this.startTime;
  }

  currentTime2() {
    this.timevalue2 = this.endTime;
    this.compareTwoDates();
  }

  restrictStartDate() {
    this.minimumStartDate = new Date();
  }

  selectEndDate() {
    this.minimumDate = new Date(this.startDate);
    let startDate = new Date(this.startDate);
    let invalidDate = new Date();
    invalidDate.setDate(startDate.getDate() - 1);
    this.invalidDates = [startDate, invalidDate];
  }

  //for break time
  initialTime3() {
    this.breakTmValue = this.timevalue3;
  }

  //for end time
  initialTime2() {
    this.endTime = this.timevalue2;
  }

  //for start time
  initialTime() {
    this.startTime = this.timevalue1;
  }

  setMode(mode: string) {
    this.clearFormArray();
    if (mode == "Edit") {
      this.btnMode = "Save";
      this.setHeadMode = "Update Availability";
    } else {
      this.btnMode = "Create";
      this.setHeadMode = "Create Availability";
    }
  }

  addAvailabilityDialog(Id?) {
    this.addAvailabilityForm.reset();
    // this.selectLocationForm.reset();
    this.availabilityDisplay = true;
    if (Id) {
      this.editAvailablityID = Id;
      this.btnMode = "Save";
      this.getStaffListDetails();
      this.getAvailabilityDetails();
    } else {
      this.staffData = [{ label: "Select staff", value: null }];
      this.getStaffListDetails();
      // this.getLocation();
    }
  }

  closeDialog() {
    this.availabilityDisplay = false;
    this.btnMode = "Create";
    this.invalidDates = [];
    this.timevalue1 = new Date();
    this.startTime = new Date();
    this.endTime = new Date();
    this.timevalue2 = new Date();
    this.timevalue3 = new Date();
    this.breakTmValue = new Date();
    this.breakTimeBoolean = true;
    this.showDuration = false;
    this.breakTmDuration = "";
    this.showBreakFields = false;
    const breakTime = this.addAvailabilityForm.get("breakTime");
    const duration = this.addAvailabilityForm.get("duration");
    // breakTime.clearValidators();
    // breakTime.updateValueAndValidity();
    // duration.clearValidators();
    // duration.updateValueAndValidity();
  }

  checkRadioVal(val) {
    if (val.target.value == "true") {
      this.everyDay = true;
      this.addAvailabilityForm.patchValue({
        week: {
          sun: true,
          mon: true,
          tue: true,
          wed: true,
          thur: true,
          fri: true,
          sat: true,
        },
      });
    } else if (val.target.value == "false") {
      this.everyDay = false;
      this.addAvailabilityForm.patchValue({
        week: {
          sun: false,
          mon: false,
          tue: false,
          wed: false,
          thur: false,
          fri: false,
          sat: false,
        },
      });
    }
  }

  addAvalability() {
    let obj = this.addAvailabilityForm.value;
    obj["startDate"] = this.SetTimeToZero(obj.startDate);
    obj["endDate"] = this.SetTimeToZero(obj.endDate);

    obj["startTime"] = this.GetDateAndTimeCombined(new Date(), obj.startTime);
    obj["endTime"] = this.GetDateAndTimeCombined(new Date(), obj.endTime);

    obj["start"] = this.GetDateAndTimeCombined(obj.startDate, obj.startTime);
    obj["end"] = this.GetDateAndTimeCombined(obj.endDate, obj.endTime);

    obj["breakTime"] = obj.breakTime.map((_break) => {
      _break.startBreakTime = this.GetDateAndTimeCombined(
        new Date(),
        _break.startBreakTime
      );
      _break.endBreakTime = this.GetDateAndTimeCombined(
        new Date(),
        _break.endBreakTime
      );
      return _break;
    });

    obj["business_id"] = this.loggedInUserDetails;

    obj["timeZone"] = moment.tz.guess();
    obj["multiBusinessExist"] = false;
  }

  clearFormArray() {
    this.breakTime = this.addAvailabilityForm.get("breakTime") as FormArray;
    while (this.breakTime.length !== 0) {
      this.breakTime.removeAt(0);
      this.breakTime.removeAt(0);
    }
  }

  SetTimeToZero(date_string) {
    let date = new Date(date_string);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.toISOString();
  }

  GetDateAndTimeCombined(date, time) {
    date = new Date(date);
    time = new Date(time);

    const date_of_month = date.getDate(),
      month = date.getMonth(),
      year = date.getFullYear(),
      hours = time.getHours(),
      minutes = time.getMinutes();

    return new Date(year, month, date_of_month, hours, minutes, 0, 0);
  }

  //for listing availabilities
  getAvailabilities() {
    let obj = {
      //business_id: this.availabilitFilterForm.value.business_id,
      business_id: this.loggedInUserDetails,
      user_id: this.availabilitFilterForm.value.staff_id,
      staff_id: this.availabilitFilterForm.value.staff_id,
      count: this.Aavilabilitycount,
      page: this.Availabilitypage,
    };

    // Business admin
  }

  gteAavilabilitypaginate(event) {
    this.Availabilitypage = event.page + 1;
    this.getAvailabilities();
  }

  isFloats(n) {
    return Number(n) === n && n % 1 !== 0;
  }

  //for fetching availability details so that it can be editable
  getAvailabilityDetails() {
    // this.isAvailabilityLoading = true;

    let obj = {
      availability_id: this.editAvailablityID ? this.editAvailablityID : "",
    };
  }

  showDeleteDialog(id) {
    this.displayDelete = false;
    this.deleteAvailablityID = id;
  }

  deleteAvailability() {}

  closeBreakTime() {
    this.showBreakFields = false;
    this.breakTmValue = new Date();
    // this.breaktimeArray=[];
    // this.addAvailabilityForm.reset({breaktimeArray:""});
    const breakTime = this.addAvailabilityForm.get("breakTime");
    const duration = this.addAvailabilityForm.get("duration");
    // breakTime.clearValidators();
    // breakTime.updateValueAndValidity();
    // duration.clearValidators();
    // duration.updateValueAndValidity();
  }

  addMultiBreakTime() {
    if (this.checkPreviousIsEmpty()) return;

    this.breakTime = this.addAvailabilityForm.get("breakTime") as FormArray;
    this.breakTime.push(this.createItem());
  }
  checkPreviousIsEmpty() {
    if (!this.breakTime.controls.length) return false;

    const { startBreakTime, endBreakTime } = this.breakTime.controls[
      this.breakTime.controls.length - 1
    ]["controls"];

    if (!Date.parse(startBreakTime.value))
      return !Date.parse(startBreakTime.value);
    if (!Date.parse(endBreakTime.value)) return !Date.parse(endBreakTime.value);
  }
  checkValidBreakTime(index) {
    const { startTime, endTime } = this.addAvailabilityForm["controls"];
    const { startBreakTime, endBreakTime } = this.breakTime.controls[index][
      "controls"
    ];

    if (this.checkPreviousIsEmpty()) {
      return;
    }

    if (!moment(startBreakTime.value).isAfter(moment(startTime.value))) {
      this.breakTime.controls[index]["controls"].startBreakTime.setErrors({
        error: { message: "" },
      });

      return;
    }

    if (!moment(endBreakTime.value).isBefore(moment(endTime.value))) {
      this.breakTime.controls[index]["controls"].endBreakTime.setErrors({
        error: { message: "break end time can not be greater than end time" },
      });

      return;
    }

    if (moment(endBreakTime.value).isBefore(moment(startBreakTime.value))) {
      this.breakTime.controls[index]["controls"].endBreakTime.setErrors({
        error: {
          message: "Break end time can not be smaller than break start time",
        },
      });

      return;
    }

    if (
      !moment(startBreakTime.value).isBetween(
        moment(startTime.value),
        moment(endTime.value)
      ) ||
      !moment(endBreakTime.value).isBetween(
        moment(startTime.value),
        moment(endTime.value)
      )
    ) {
      this.breakTime.controls[index]["controls"].startBreakTime.setErrors({
        error: { message: "Time is not between start and end" },
      });

      return;
    }

    this.breakTime.controls.map((formControl, i) => {
      this.breakTime.controls[i]["controls"].startBreakTime.setErrors(null);
      this.breakTime.controls[i]["controls"].endBreakTime.setErrors(null);
    });
    this.breakTime.controls.map((formControl, i) => {
      if (i != index) {
        const compare_break_start =
          formControl["controls"]["startBreakTime"].value;
        const compare_break_end = formControl["controls"]["endBreakTime"].value;

        if (
          moment(startBreakTime.value).isBetween(
            moment(compare_break_start),
            moment(compare_break_end)
          )
        ) {
          this.breakTime.controls[index]["controls"].startBreakTime.setErrors({
            error: { message: "Time is between the already given break time" },
          });
        } else if (
          moment(endBreakTime.value).isBetween(
            moment(compare_break_start),
            moment(compare_break_end)
          )
        ) {
          this.breakTime.controls[index]["controls"].endBreakTime.setErrors({
            error: { message: "Time is between the already given break time" },
          });
        } else if (
          moment(startBreakTime.value).isBefore(moment(compare_break_start)) &&
          moment(startBreakTime.value).isAfter(moment(compare_break_end))
        ) {
          this.breakTime.controls[index]["controls"].startBreakTime.setErrors({
            error: {
              message: "Time is in between of already given break time",
            },
          });
        } else if (
          moment(endBreakTime.value).isBefore(moment(compare_break_start)) &&
          moment(endBreakTime.value).isAfter(moment(compare_break_end))
        ) {
          this.breakTime.controls[index]["controls"].endBreakTime.setErrors({
            error: {
              message: "Time is in between of already given break time",
            },
          });
        }

        // else if (moment(startBreakTime.value).isBefore(moment(compare_break_start))) {

        //   this.breakTime.controls[index]['controls'].startBreakTime.setErrors({ error: { message: 'Break time should be in sequence' } });
        //   return
        // }
        else if (
          moment(startBreakTime.value).isBefore(moment(compare_break_start)) &&
          moment(endBreakTime.value).isAfter(moment(compare_break_end))
        ) {
          this.breakTime.controls[index]["controls"].startBreakTime.setErrors({
            error: { message: "Time is overlapping already given break time." },
          });
          this.breakTime.controls[index]["controls"].endBreakTime.setErrors({
            error: { message: "Time is overlapping already given break time." },
          });
        }
      }
    });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      startBreakTime: ["", [Validators.required]],
      endBreakTime: ["", [Validators.required]],
    });
  }

  timeValidator(params: any): ValidatorFn {
    return (control: AbstractControl) => {
      if (!this.addAvailabilityForm.get("endTime").value) {
        return {
          error: { message: "Please select end time" },
        };
      }
      if (!this.addAvailabilityForm.get("startTime").value) {
        return {
          error: { message: "Please select start time" },
        };
      }

      if (Date.parse(control.value) === NaN) {
        return {
          error: { message: "Invalid time" },
        };
      }

      if (Date.parse(this.addAvailabilityForm.get("endTime").value) === NaN) {
        return {
          error: { message: "Invalid end time" },
        };
      }

      if (Date.parse(this.addAvailabilityForm.get("startTime").value) === NaN) {
        return {
          error: { message: "Invalid start time" },
        };
      }

      const breakTime = this.addAvailabilityForm.get("breakTime") as FormArray;

      const startTime =
        new Date(this.addAvailabilityForm.get("startTime").value).getHours() *
          60 +
        new Date(this.addAvailabilityForm.get("startTime").value).getMinutes();
      const endTime =
        new Date(this.addAvailabilityForm.get("endTime").value).getHours() *
          60 +
        new Date(this.addAvailabilityForm.get("endTime").value).getMinutes();
      const currentTime =
        new Date(control.value).getHours() * 60 +
        new Date(control.value).getMinutes();

      // if (this.breakTime.value.length > 0) {
      //   for (var j = 0; j < this.breakTime.value.length; j++) {

      //     if (new Date(this.breakTime.value[j].endBreakTime) < new Date(this.breakTime.value[j].startBreakTime)) {
      //       this.breakError = { isError: true, errorMessage: "End Break time can't before start break time" };
      //     } else {
      //       this.breakError = {
      //         isError: false,
      //         errorMessage: ''
      //       }
      //     }
      //   }
      // }
      if (params === "start") {
        let last_end_time =
          breakTime.controls.length > 1
            ? breakTime.controls[breakTime.controls.length - 2].get(
                "endBreakTime"
              ).value
            : 0;

        last_end_time = last_end_time
          ? new Date(last_end_time).getHours() * 60 +
            new Date(last_end_time).getMinutes()
          : 0;

        if (currentTime <= startTime) {
          return {
            error: { message: "Time should be greator than start time" },
          };
        }

        if (currentTime >= endTime) {
          return {
            error: { message: "Time should be less than end time" },
          };
        }
        // if (breakTime.controls.length > 1 && last_end_time >= currentTime) {
        //   return {
        //     "error": { 'message': "Time should be grertor than previous break end time" }
        //   }
        // }
      } else {
        let last_start_time = breakTime.controls.length
          ? breakTime.controls[breakTime.controls.length - 1].get(
              "startBreakTime"
            ).value
          : 0;

        last_start_time = last_start_time
          ? new Date(last_start_time).getHours() * 60 +
            new Date(last_start_time).getMinutes()
          : 0;

        // if (!last_start_time || Date.parse(last_start_time) === NaN) {
        //   return {
        //     "error": { 'message': "Invalid break start time" }
        //   }
        // }

        if (currentTime >= endTime) {
          return {
            error: { message: "Break end time should be less than end time" },
          };
        }

        if (this.breakTime.value.length > 1) {
          for (var k = 0; k < this.breakTime.value.length; k++) {
            const loopEndTime =
              new Date(this.breakTime.value[k].endBreakTime).getHours() * 60 +
              new Date(this.breakTime.value[k].endBreakTime).getMinutes();
            if (loopEndTime === NaN) {
            } else {
              if (currentTime < loopEndTime) {
                return {
                  error: {
                    message:
                      "Please choose the break end time not in the range of already given break time.",
                  },
                };
              }
            }
          }
        }

        // if (currentTime <= last_start_time) {
        //   return {
        //     "error": { 'message': "Break end should be greator than break start time" }
        //   }
        // }
      }
      return null;
    };
  }

  startBreakTimeSelected(e) {
    if (
      this.addAvailabilityForm.value.startTime != null ||
      this.addAvailabilityForm.value.endTime != null
    ) {
      var startBTime = moment(
        this.addAvailabilityForm.value.startTime,
        "YYYY-MM-DD h:mm a"
      );
      var endBTime = moment(
        this.addAvailabilityForm.value.endTime,
        "YYYY-MM-DD h:mm a"
      );
      var beginningTime = moment(e, "YYYY-MM-DD h:mm a");
      var t1 = this.getmomentTime(startBTime);
      var t2 = this.getmomentTime(endBTime);
      var begin = this.getmomentTime(beginningTime);
      if (begin.isBetween(t1, t2)) {
        this.breakTimeBoolean = true;
      } else {
        this.breakTimeBoolean = false;
      }
    }
  }
  endBreakTimeSelected(e) {
    if (
      this.addAvailabilityForm.value.startTime != null ||
      this.addAvailabilityForm.value.endTime != null
    ) {
      var startBTime = moment(
        this.addAvailabilityForm.value.startTime,
        "YYYY-MM-DD h:mm a"
      );
      var endBTime = moment(
        this.addAvailabilityForm.value.endTime,
        "YYYY-MM-DD h:mm a"
      );
      var beginningTime = moment(e, "YYYY-MM-DD h:mm a");
      var t1 = this.getmomentTime(startBTime);
      var t2 = this.getmomentTime(endBTime);
      var begin = this.getmomentTime(beginningTime);
      if (begin.isBetween(t1, t2)) {
        this.breakEndTimeBoolean = true;
      } else {
        this.breakEndTimeBoolean = false;
      }
    }
  }
  removeMultiBreakTime(i) {
    this.breakTime.removeAt(i);
  }
  getmomentTime(m) {
    return moment({ hour: m.hour(), minute: m.minute() });
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      let firstDt = new Date(f.value);
      let endDt = new Date(t.value);
      if (firstDt.getTime() < endDt.getTime()) {
        return {
          dates: "Date from should be less than Date to",
        };
      }
      return {};
    };
  }
  compareTwoDates() {
    if (
      new Date(this.addAvailabilityForm.controls["endTime"].value) <
      new Date(this.addAvailabilityForm.controls["startTime"].value)
    ) {
      this.error = {
        isError: true,
        errorMessage: "End time can't before start time",
      };
    } else {
      this.error = {
        isError: false,
        errorMessage: "",
      };
    }
  }

  getValidity(i) {
    const breakTime = this.addAvailabilityForm.get("breakTime") as FormArray;
    if (
      new Date(breakTime.controls[i].value.endBreakTime) <=
      new Date(breakTime.controls[i].value.startBreakTime)
    ) {
      return "Break end time can't before break start time";
    }
  }

  // For clinic location list
  // getClinicLocation() {

  //   let getLoctionObj = {
  //     "userId": this.loggedInUserDetails ? this.loggedInUserDetails._id : ''
  //   }

  //   if (this.loggedInUserDetails.userType == appConfig.userType.BUSINESS) {

  //     this.filterClinicLoactionsList = [
  //       { label: 'Select location', value: null }
  //     ]

  //     this.addAvailabilityClinicLoactionsList = [
  //       { label: 'Select location', value: null }
  //     ]

  //     this.availabilityService.getListOfLocation(getLoctionObj)
  //       .subscribe(res => {
  //         if (res && res.code == 200 && res.data && res.data.length) {
  //           let fetchClinincLocation = res.data;
  //           for (let i = 0; i < fetchClinincLocation.length; i++) {
  //             let item = {
  //               label: fetchClinincLocation[i].location,
  //               value: fetchClinincLocation[i]._id
  //             }

  //             this.filterClinicLoactionsList.push(item);
  //             this.addAvailabilityClinicLoactionsList.push(item);
  //           }

  //         } else {
  //           this.filterClinicLoactionsList = [
  //             { label: 'Select location', value: null }
  //           ]

  //           this.addAvailabilityClinicLoactionsList = [
  //             { label: 'Select location', value: null }
  //           ]
  //         }
  //       });
  //   }

  // }

  // For  Staff list
  getStaffListDetails() {
    let getStaffObj = {
      business_id: "",
      staff_id: "",
    };

    // Business admin
  }

  // For Business list
  getBusinessList() {
    let obj = {
      user_id: this.loggedInUserDetails,
      userType: this.loggedInUserDetailsData,
      // reqAcceptedForClinicLocation: true
    };
  }

  // For staff or physician location
  // getStaffClinicAssociatedLoaction() {
  //   let obj = {
  //     user_id: this.loggedInUserDetails._id,
  //     userType: this.loggedInUserDetails.userType,
  //     reqAcceptedForClinicLocation: true,
  //   }

  //   if (this.availabilitFilterForm.get('business_id').value) {
  //     obj['business_id'] = this.availabilitFilterForm.get('business_id').value
  //   }

  //   if (this.addAvailabilityForm.get('clinic').value) {
  //     obj['business_id'] = this.addAvailabilityForm.get('clinic').value
  //   }

  //   if (this.checkAccess.location && this.loggedInUserDetails.userType != appConfig.userType.BUSINESS) {
  //     this.filterClinicLoactionsList = [
  //       { label: 'Select location', value: null }
  //     ]

  //     this.addAvailabilityClinicLoactionsList = [
  //       { label: 'Select location', value: null }
  //     ]
  //     this.profileService.getListOfAddedClinic(obj).subscribe(res => {
  //       if (res && res.code == 200 && res.data && res.data.length) {
  //         for (let i = 0; i <  res.data.length; i++) {
  //             if(res.data[i].location_id){
  //             let loactionObj = {
  //               label:  res.data[i].location_id.location,
  //               value:  res.data[i].location_id._id
  //             }
  //             this.filterClinicLoactionsList.push(loactionObj);
  //             this.addAvailabilityClinicLoactionsList.push(loactionObj);
  //             if(this.filterClinicLoactionsList.length > 0 && res.data[i].location_id.isDefaultLoc == true){
  //               this.availabilitFilterForm.get('location_id').setValue(res.data[i].location_id._id);
  //             }
  //           }
  //         }
  //         if(this.availabilitFilterForm.get('location_id').value == null || this.availabilitFilterForm.get('location_id').value == ''){
  //           this.availabilitFilterForm.get('location_id').setValue(res.data[0].location_id._id);
  //         }
  //       } else {
  //         this.filterClinicLoactionsList = [
  //           { label: 'Select location', value: null }
  //         ]

  //         this.addAvailabilityClinicLoactionsList = [
  //           { label: 'Select location', value: null }
  //         ]
  //       }
  //     });
  //   }
  // }

  businessFilterChange(data) {}

  locationFilterChange(data) {
    if (data.value) {
      this.getStaffListDetails();
      this.getAvailabilities();
    }
  }

  staffFilterChange(data) {
    if (data.value) {
      this.getAvailabilities();
    }
  }

  addAvailbilityClinicChange(data) {}

  addAvailbilityLocationChange(data) {
    if (data.value) {
      this.getStaffListDetails();
      this.getAvailabilities();
    }
  }

  addAvailbilityPhysicianChange(data) {
    if (data.value) {
      this.getAvailabilities();
    }
  }
}
