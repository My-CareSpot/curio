import { Component, OnInit } from "@angular/core";
//import { GenralService } from '../../../../core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
//import { genralConfig } from '../../../../core/constant/genral-config.constant';
import { CalendarsettingService } from "../services/calendarsetting.service";
import { ToastrService } from "ngx-toastr";

// import * as moment from 'moment'
import * as moment from "moment-timezone";
import { Router } from "@angular/router";
import tzlookup from "tz-lookup";
//import { WebLocalStorage } from '../../../web.storage';
import { LocalService } from "src/app/local.service";
import { CommonService } from "src/app/common.service";
@Component({
  selector: "app-set-availability",
  templateUrl: "./set-availability.component.html",
  styleUrls: ["./set-availability.component.scss"],
})
export class SetAvailabilityComponent implements OnInit {
  careTeamListTemp: any;
  availibilitiesData: any;
  careTakerName: any;
  displayedColumns: any = ["name", "start", "end", "actions"];
  isEdit: boolean;
  weekData = [
    {
      id: 0,
      name: "Sunday",
      isChecked: false,
    },
    {
      id: 1,
      name: "Monday",
      isChecked: false,
    },
    {
      id: 2,
      name: "Tuesday",
      isChecked: false,
    },
    {
      id: 3,
      name: "Wednesday",
      isChecked: false,
    },
    {
      id: 4,
      name: "Thursday",
      isChecked: false,
    },
    {
      id: 5,
      name: "Friday",
      isChecked: false,
    },
    {
      id: 6,
      name: "Saturday",
      isChecked: false,
    },
  ];
  isDisabled: boolean = false;
  setAvailabilityForm: FormGroup;
  sundayForm: FormGroup;
  mondayForm: FormGroup;
  tuesdayForm: FormGroup;
  wednesdayForm: FormGroup;
  thursdayForm: FormGroup;
  fridayForm: FormGroup;
  saturdayForm: FormGroup;
  showMondayPlusBtn: boolean = true;
  showTuesdayPlusBtn: boolean = true;
  showWednesdayPlusBtn: boolean = true;
  showThursdayPlusBtn: boolean = true;
  showFridayPlusBtn: boolean = true;
  showSaturdayPlusBtn: boolean = true;
  showSundayPlusBtn: boolean = true;
  locationCount: any = 10;
  locationPage = 1;
  loggedInUserDetails: any;
  specialistLocations: any = [];
  specialistAvailability: any = [];
  loader: boolean = false;
  tzNames: string[];
  buttonTxt: string = "Add";
  timingsArray = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  lat: number;
  long: number;
  timezone: any;
  min = new Date();
  max = new Date();
  duration = 15;
  userData: any;
  user_id: any;
  isCareTaker: boolean = false;
  doctorList: any;
  checkedList: any;
  UserList: any;
  doctorlistData: any = [];
  caretaker_user_id: any;

  //duration = [30, 45, 50, 60, 90, 120, 240, 440]
  constructor(
    //private _genralServices: GenralService,
    private formBuilder: FormBuilder,
    //private _webStorage: WebLocalStorage,
    private _calendarSettingService: CalendarsettingService,
    private toastr: ToastrService,
    private router: Router,
    private localServ: LocalService,
    private comService: CommonService
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;

    //this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //this.loggedInUserDetails = this._webStorage.get('all');
    this.loggedInUserDetails = JSON.parse(this.localServ.getJsonValue("user"));

    //this.listSpecialistLocations();
    this.tzNames = moment.tz.names();
    this.setAvailabilityForm = this.formBuilder.group({
      //location: ['', Validators.required],
      //specialDate:[''],
      //offerdescp:[''],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      specialist_id: ["", Validators.required],
      duration: ["", Validators.required],
    });

    this.setAvailabilityForm
      .get("specialist_id")
      .valueChanges.subscribe((data: any) => {
        this.caretaker_user_id = data;
        this.getCareTakerAvailibility(this.caretaker_user_id);
      });

    this.sundayForm = this.formBuilder.group({
      id: 0,
      name: "Sunday",
      isChecked: [false],
      arrayOfTimings: this.formBuilder.array([]),
    });

    this.mondayForm = this.formBuilder.group({
      id: 1,
      name: "Monday",
      isChecked: [false],
      arrayOfTimings: this.formBuilder.array([]),
    });

    this.tuesdayForm = this.formBuilder.group({
      id: 2,
      name: "Tuesday",
      isChecked: [false],
      arrayOfTimings: this.formBuilder.array([]),
    });

    this.wednesdayForm = this.formBuilder.group({
      id: 3,
      name: "Wednesday",
      isChecked: [false],
      arrayOfTimings: this.formBuilder.array([]),
    });

    this.thursdayForm = this.formBuilder.group({
      id: 4,
      name: "Thursday",
      isChecked: [false],
      arrayOfTimings: this.formBuilder.array([]),
    });

    this.fridayForm = this.formBuilder.group({
      id: 5,
      name: "Friday",
      isChecked: [false],
      arrayOfTimings: this.formBuilder.array([]),
    });

    this.saturdayForm = this.formBuilder.group({
      id: 6,
      name: "Saturday",
      isChecked: [false],
      arrayOfTimings: this.formBuilder.array([]),
    });

    // this.addTimings();
    this.addSundayTimings();
    this.addMondayTimings();
    this.addTuesdayTimings();
    this.addWednesdayTimings();
    this.addThursdayTimings();
    this.addFridayTimings();
    this.addSaturdayTimings();
    //this.getSpecialistAvailability();
    this.getList();
  }

  addSundayTimings() {
    if (this.multipleSundayTimes.length < 5) {
      const time = this.formBuilder.group({
        startTime: [""],
        endTime: [""],
      });
      this.multipleSundayTimes.push(time);
    } else {
      this.toastr.error("Only 5 times allowed");
    }
  }

  get multipleSundayTimes() {
    return this.sundayForm.get("arrayOfTimings") as FormArray;
  }

  deleteSundayTimings(i) {
    this.multipleSundayTimes.removeAt(i);
  }

  addMondayTimings() {
    if (this.multipleMondayTimes.length < 5) {
      const time = this.formBuilder.group({
        startTime: [""],
        endTime: [""],
      });
      this.multipleMondayTimes.push(time);
    } else {
      this.toastr.error("Only 5 times allowed");
    }
  }

  get multipleMondayTimes() {
    return this.mondayForm.get("arrayOfTimings") as FormArray;
  }

  deleteMondayTimings(i) {
    this.multipleMondayTimes.removeAt(i);
  }

  addTuesdayTimings() {
    if (this.multipleTuesdayTimes.length < 5) {
      const time = this.formBuilder.group({
        startTime: [""],
        endTime: [""],
      });
      this.multipleTuesdayTimes.push(time);
    } else {
      this.toastr.error("Only 5 times allowed");
    }
  }

  get multipleTuesdayTimes() {
    return this.tuesdayForm.get("arrayOfTimings") as FormArray;
  }

  deleteTuesdayTimings(i) {
    this.multipleTuesdayTimes.removeAt(i);
  }

  addWednesdayTimings() {
    if (this.multipleWednesdayTimes.length < 5) {
      const time = this.formBuilder.group({
        startTime: [""],
        endTime: [""],
      });
      this.multipleWednesdayTimes.push(time);
    } else {
      this.toastr.error("Only 5 times allowed");
    }
  }

  get multipleWednesdayTimes() {
    return this.wednesdayForm.get("arrayOfTimings") as FormArray;
  }

  deleteWednesdayTimings(i) {
    this.multipleWednesdayTimes.removeAt(i);
  }

  addThursdayTimings() {
    if (this.multipleThursdayTimes.length < 5) {
      const time = this.formBuilder.group({
        startTime: [""],
        endTime: [""],
      });
      this.multipleThursdayTimes.push(time);
    } else {
      this.toastr.error("Only 5 times allowed");
    }
  }

  get multipleThursdayTimes() {
    return this.thursdayForm.get("arrayOfTimings") as FormArray;
  }

  deleteThursdayTimings(i) {
    this.multipleThursdayTimes.removeAt(i);
  }

  addFridayTimings() {
    if (this.multipleFridayTimes.length < 5) {
      const time = this.formBuilder.group({
        startTime: [""],
        endTime: [""],
      });
      this.multipleFridayTimes.push(time);
    } else {
      this.toastr.error("Only 5 times allowed");
    }
  }

  get multipleFridayTimes() {
    return this.fridayForm.get("arrayOfTimings") as FormArray;
  }

  deleteFridayTimings(i) {
    this.multipleFridayTimes.removeAt(i);
  }

  addSaturdayTimings() {
    if (this.multipleSaturdayTimes.length < 5) {
      const time = this.formBuilder.group({
        startTime: [""],
        endTime: [""],
      });
      this.multipleSaturdayTimes.push(time);
    } else {
      this.toastr.error("Only 5 times allowed");
    }
  }

  get multipleSaturdayTimes() {
    return this.saturdayForm.get("arrayOfTimings") as FormArray;
  }

  deleteSaturdayTimings(i) {
    this.multipleSaturdayTimes.removeAt(i);
  }

  goBack() {
    //this._genralServices.goBack();
  }

  getList() {
    let obj = {
      hospital_id: this.user_id,
    };
    this.comService.getHospitalCareTaker(obj).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.doctorList = data.data;
          console.log("PatientList", this.doctorList);
        } else if (data.code === 400) {
          this.toastr.error(data.message, "", {
            timeOut: 1000,
          });
        }
      },
      (error) => {
        this.toastr.error(error.error, "", {
          timeOut: 1000,
        });
      }
    );
  }

  updateAvailability() {
    if (
      this.sundayForm.value.isChecked &&
      this.sundayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.sundayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.sundayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.sundayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.sundayForm.value.arrayOfTimings[i].startTime = moment(tempSTime)
            .utc()
            .format();
          this.sundayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Sunday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.mondayForm.value.isChecked &&
      this.mondayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.mondayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.mondayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.mondayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.mondayForm.value.arrayOfTimings[i].startTime = moment(tempSTime)
            .utc()
            .format();
          this.mondayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Monday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.tuesdayForm.value.isChecked &&
      this.tuesdayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.tuesdayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.tuesdayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.tuesdayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.tuesdayForm.value.arrayOfTimings[i].startTime = moment(tempSTime)
            .utc()
            .format();
          this.tuesdayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Tuesday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.wednesdayForm.value.isChecked &&
      this.wednesdayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.wednesdayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.wednesdayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.wednesdayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.wednesdayForm.value.arrayOfTimings[i].startTime = moment(
            tempSTime
          )
            .utc()
            .format();
          this.wednesdayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Wednesday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.thursdayForm.value.isChecked &&
      this.thursdayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.thursdayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.thursdayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.thursdayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.thursdayForm.value.arrayOfTimings[i].startTime = moment(
            tempSTime
          )
            .utc()
            .format();
          this.thursdayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Thursday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.fridayForm.value.isChecked &&
      this.fridayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.fridayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.fridayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.fridayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.fridayForm.value.arrayOfTimings[i].startTime = moment(tempSTime)
            .utc()
            .format();
          this.fridayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Friday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.saturdayForm.value.isChecked &&
      this.saturdayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.saturdayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.saturdayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.saturdayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.saturdayForm.value.arrayOfTimings[i].startTime = moment(
            tempSTime
          )
            .utc()
            .format();
          this.saturdayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Saturday end time should be greater than start time"
          );
        }
      }
    }

    let tempArr = [
      this.sundayForm.value,
      this.mondayForm.value,
      this.tuesdayForm.value,
      this.wednesdayForm.value,
      this.thursdayForm.value,
      this.fridayForm.value,
      this.saturdayForm.value,
    ];
    // let result = tempArr.map(a=>a.isChecked);
    let tempObj = {
      //location: this.setAvailabilityForm.value.location,
      //offerdescp: this.setAvailabilityForm.value.offerdescp,
      //specialOfferDate:moment(this.setAvailabilityForm.value.specialDate).startOf('day'),
      startDate: moment(this.setAvailabilityForm.value.startDate).startOf(
        "day"
      ),
      endDate: moment(this.setAvailabilityForm.value.endDate).endOf("day"),
      timeZone: this.timezone,
      week: tempArr,
      //specialist_id: this.loggedInUserDetails._id,
      user_id: this.caretaker_user_id,
      availability_id: this.specialistAvailability._id
        ? this.specialistAvailability._id
        : "",
      duration: 15, //this.setAvailabilityForm.value.duration
    };

    this.comService
      .updateSpecialistAvailability(tempObj)
      .subscribe((res: any) => {
        if (res && res.code == 200) {
          //this.buttonTxt = "Save ";
          this.toastr.success(res.message);

          // this.getSpecialistAvailability();
          this.getCareTakerAvailibility(this.caretaker_user_id);
          this.isEdit = false;
        } else {
          this.toastr.warning(res.message);
        }
      });
  }

  setAvailability() {
    if (
      this.sundayForm.value.isChecked &&
      this.sundayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.sundayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.sundayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.sundayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.sundayForm.value.arrayOfTimings[i].startTime = moment(tempSTime)
            .utc()
            .format();
          this.sundayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Sunday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.mondayForm.value.isChecked &&
      this.mondayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.mondayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.mondayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.mondayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.mondayForm.value.arrayOfTimings[i].startTime = moment(tempSTime)
            .utc()
            .format();
          this.mondayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Monday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.tuesdayForm.value.isChecked &&
      this.tuesdayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.tuesdayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.tuesdayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.tuesdayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.tuesdayForm.value.arrayOfTimings[i].startTime = moment(tempSTime)
            .utc()
            .format();
          this.tuesdayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Tuesday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.wednesdayForm.value.isChecked &&
      this.wednesdayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.wednesdayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.wednesdayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.wednesdayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.wednesdayForm.value.arrayOfTimings[i].startTime = moment(
            tempSTime
          )
            .utc()
            .format();
          this.wednesdayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Wednesday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.thursdayForm.value.isChecked &&
      this.thursdayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.thursdayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.thursdayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.thursdayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.thursdayForm.value.arrayOfTimings[i].startTime = moment(
            tempSTime
          )
            .utc()
            .format();
          this.thursdayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Thursday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.fridayForm.value.isChecked &&
      this.fridayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.fridayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.fridayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.fridayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.fridayForm.value.arrayOfTimings[i].startTime = moment(tempSTime)
            .utc()
            .format();
          this.fridayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Friday end time should be greater than start time"
          );
        }
      }
    }

    if (
      this.saturdayForm.value.isChecked &&
      this.saturdayForm.value.arrayOfTimings.length
    ) {
      let sDate = moment(this.setAvailabilityForm.value.startDate).format(
        "YYYY/MM/DD"
      );
      let eDate = moment(this.setAvailabilityForm.value.endDate).format(
        "YYYY/MM/DD"
      );
      for (let i = 0; i < this.saturdayForm.value.arrayOfTimings.length; i++) {
        let sTime = moment(
          this.saturdayForm.value.arrayOfTimings[i].startTime
        ).format("HH:mm:ss");
        let eTime = moment(
          this.saturdayForm.value.arrayOfTimings[i].endTime
        ).format("HH:mm:ss");

        let tempSTime = moment(sDate + " " + sTime);
        let tempETime = moment(eDate + " " + eTime);
        let cmpEtime = moment(sDate + " " + eTime);
        tempSTime.set({ second: 0 });
        tempETime.set({ second: 0 });
        cmpEtime.set({ second: 0 });
        if (cmpEtime > tempSTime) {
          this.saturdayForm.value.arrayOfTimings[i].startTime = moment(
            tempSTime
          )
            .utc()
            .format();
          this.saturdayForm.value.arrayOfTimings[i].endTime = moment(tempETime)
            .utc()
            .format();
        } else {
          this.toastr.warning(
            "Saturday end time should be greater than start time"
          );
        }
      }
    }

    let tempArr = [
      this.sundayForm.value,
      this.mondayForm.value,
      this.tuesdayForm.value,
      this.wednesdayForm.value,
      this.thursdayForm.value,
      this.fridayForm.value,
      this.saturdayForm.value,
    ];
    // let result = tempArr.map(a=>a.isChecked);
    let tempObj = {
      //location: this.setAvailabilityForm.value.location,
      //offerdescp: this.setAvailabilityForm.value.offerdescp,
      //specialOfferDate:moment(this.setAvailabilityForm.value.specialDate).startOf('day'),
      startDate: moment(this.setAvailabilityForm.value.startDate).startOf(
        "day"
      ),
      endDate: moment(this.setAvailabilityForm.value.endDate).endOf("day"),
      timeZone: this.timezone,
      week: tempArr,
      //specialist_id: this.loggedInUserDetails._id,
      user_id: this.caretaker_user_id,
      availability_id: this.specialistAvailability._id
        ? this.specialistAvailability._id
        : "",
      duration: 15,
    };

    this.comService.addSpecialistAvailability(tempObj).subscribe((res: any) => {
      if (res && res.code == 200) {
        //this.buttonTxt = "Save ";
        this.toastr.success(res.message);

        // this.getSpecialistAvailability();
        this.getCareTakerAvailibility(this.caretaker_user_id);
        // this.isEdit = true;
      } else {
        this.toastr.warning(res.message);
      }
    });
  }

  loadMultipleSundays(data) {
    this.sundayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    for (let i = 0; i < data.length; i++) {
      this.addSundayTimings();
      this.sundayForm.get("arrayOfTimings").patchValue(data);
    }
  }
  loadMultipleWednesdays(data) {
    this.wednesdayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.wednesdayForm.controls["arrayOfTimings"].reset();
    this.wednesdayForm.value.arrayOfTimings = [];
    this.wednesdayForm.controls["arrayOfTimings"].reset();
    for (let i = 0; i < data.length; i++) {
      this.addWednesdayTimings();
      this.wednesdayForm.get("arrayOfTimings").patchValue(data);
    }
  }
  loadMultipleMondays(data) {
    this.mondayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.mondayForm.controls["arrayOfTimings"].reset();
    this.mondayForm.value.arrayOfTimings = [];
    this.mondayForm.controls["arrayOfTimings"].reset();
    for (let i = 0; i < data.length; i++) {
      this.addMondayTimings();
      this.mondayForm.get("arrayOfTimings").patchValue(data);
    }
  }
  loadMultipleTuesdays(data) {
    this.tuesdayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.tuesdayForm.controls["arrayOfTimings"].reset();
    this.tuesdayForm.value.arrayOfTimings = [];
    this.tuesdayForm.controls["arrayOfTimings"].reset();
    for (let i = 0; i < data.length; i++) {
      this.addTuesdayTimings();
      this.tuesdayForm.get("arrayOfTimings").patchValue(data);
    }
  }
  loadMultipleThursdays(data) {
    this.thursdayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.thursdayForm.controls["arrayOfTimings"].reset();
    this.thursdayForm.value.arrayOfTimings = [];
    this.thursdayForm.controls["arrayOfTimings"].reset();
    for (let i = 0; i < data.length; i++) {
      this.addThursdayTimings();
      this.thursdayForm.get("arrayOfTimings").patchValue(data);
    }
  }
  loadMultipleFridays(data) {
    this.fridayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.fridayForm.controls["arrayOfTimings"].reset();
    this.fridayForm.value.arrayOfTimings = [];
    this.fridayForm.controls["arrayOfTimings"].reset();
    for (let i = 0; i < data.length; i++) {
      this.addFridayTimings();
      this.fridayForm.get("arrayOfTimings").patchValue(data);
    }
  }
  loadMultipleSaturdays(data) {
    this.saturdayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.saturdayForm.controls["arrayOfTimings"].reset();
    this.saturdayForm.value.arrayOfTimings = [];
    this.saturdayForm.controls["arrayOfTimings"].reset();
    for (let i = 0; i < data.length; i++) {
      this.addSaturdayTimings();
      this.saturdayForm.get("arrayOfTimings").patchValue(data);
    }
  }

  getCareTakerAvailibility(data) {
    let dataToPass = {
      user_id: data,
    };
    this.comService
      .getCareTakerAvailibility(dataToPass)
      .subscribe((data: any) => {
        console.log("AVAILIBILITIES", data);
        if (data.code === 200) {
          this.availibilitiesData = data.data;
          //this.isEdit = true;
          this.specialistAvailability = data.data;
          this.sundayForm.controls["isChecked"].reset();
          this.mondayForm.controls["isChecked"].reset();
          this.tuesdayForm.controls["isChecked"].reset();
          this.wednesdayForm.controls["isChecked"].reset();
          this.thursdayForm.controls["isChecked"].reset();
          this.fridayForm.controls["isChecked"].reset();
          this.saturdayForm.controls["isChecked"].reset();
          this.sundayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.mondayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.tuesdayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.wednesdayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.thursdayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.fridayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.saturdayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.addSundayTimings();
          this.addMondayTimings();
          this.addTuesdayTimings();
          this.addWednesdayTimings();
          this.addThursdayTimings();
          this.addFridayTimings();
          this.addSaturdayTimings();
          this.setAvailabilityForm.patchValue({
            specialDate: this.owlDateFormat(
              this.specialistAvailability.specialOfferDate,
              this.specialistAvailability.availTimeZone
            ), //moment.tz(this.specialistAvailability.fromDateTime, this.specialistAvailability.availTimeZone).format()
            startDate: this.owlDateFormat(
              this.specialistAvailability.fromDateTime,
              this.specialistAvailability.availTimeZone
            ), //moment.tz(this.specialistAvailability.fromDateTime, this.specialistAvailability.availTimeZone).format()
            endDate: this.owlDateFormat(
              this.specialistAvailability.toDateTime,
              this.specialistAvailability.availTimeZone
            ), //moment.tz(this.specialistAvailability.endDate, this.specialistAvailability.availTimeZone).format(),
            //location: this.specialistAvailability.location_id,
            duration: this.specialistAvailability.duration,
          });
          if (
            this.specialistAvailability.available_days &&
            this.specialistAvailability.available_days.length
          ) {
            for (
              let i = 0;
              i < this.specialistAvailability.available_days.length;
              i++
            ) {
              if (this.specialistAvailability.available_days[i].id == 0) {
                this.sundayForm.patchValue({
                  isChecked: this.specialistAvailability.available_days[i]
                    .isChecked
                    ? this.specialistAvailability.available_days[i].isChecked
                    : false,
                });
                this.loadMultipleSundays(
                  this.specialistAvailability.available_days[i].arrayOfTimings
                );
              }

              if (this.specialistAvailability.available_days[i].id == 1) {
                this.mondayForm.patchValue({
                  isChecked: this.specialistAvailability.available_days[i]
                    .isChecked
                    ? this.specialistAvailability.available_days[i].isChecked
                    : false,
                });
                this.loadMultipleMondays(
                  this.specialistAvailability.available_days[i].arrayOfTimings
                );
              }

              if (this.specialistAvailability.available_days[i].id == 2) {
                this.tuesdayForm.patchValue({
                  isChecked: this.specialistAvailability.available_days[i]
                    .isChecked
                    ? this.specialistAvailability.available_days[i].isChecked
                    : false,
                });
                this.loadMultipleTuesdays(
                  this.specialistAvailability.available_days[i].arrayOfTimings
                );
              }
              if (this.specialistAvailability.available_days[i].id == 3) {
                this.wednesdayForm.patchValue({
                  isChecked: this.specialistAvailability.available_days[i]
                    .isChecked
                    ? this.specialistAvailability.available_days[i].isChecked
                    : false,
                });
                this.loadMultipleWednesdays(
                  this.specialistAvailability.available_days[i].arrayOfTimings
                );
              }
              if (this.specialistAvailability.available_days[i].id == 4) {
                this.thursdayForm.patchValue({
                  isChecked: this.specialistAvailability.available_days[i]
                    .isChecked
                    ? this.specialistAvailability.available_days[i].isChecked
                    : false,
                });
                this.loadMultipleThursdays(
                  this.specialistAvailability.available_days[i].arrayOfTimings
                );
              }
              if (this.specialistAvailability.available_days[i].id == 5) {
                this.fridayForm.patchValue({
                  isChecked: this.specialistAvailability.available_days[i]
                    .isChecked
                    ? this.specialistAvailability.available_days[i].isChecked
                    : false,
                  arrayOfTimings: this.specialistAvailability.available_days[i]
                    .arrayOfTimings,
                });
                this.loadMultipleFridays(
                  this.specialistAvailability.available_days[i].arrayOfTimings
                );
              }
              if (this.specialistAvailability.available_days[i].id == 6) {
                this.saturdayForm.patchValue({
                  isChecked: this.specialistAvailability.available_days[i]
                    .isChecked
                    ? this.specialistAvailability.available_days[i].isChecked
                    : false,
                });
                this.loadMultipleSaturdays(
                  this.specialistAvailability.available_days[i].arrayOfTimings
                );
              }
            }
          }
        } else if (data.code === 400) {
          this.isEdit = false;
          this.toastr.warning(
            "No Availibility Added",
            "Please add your availibility"
          );
          this.specialistAvailability = {};
          this.setAvailabilityForm.controls["startDate"].reset();
          this.setAvailabilityForm.controls["endDate"].reset();
          this.setAvailabilityForm.controls["duration"].reset();
          this.sundayForm.controls["isChecked"].reset();
          this.mondayForm.controls["isChecked"].reset();
          this.tuesdayForm.controls["isChecked"].reset();
          this.wednesdayForm.controls["isChecked"].reset();
          this.thursdayForm.controls["isChecked"].reset();
          this.fridayForm.controls["isChecked"].reset();
          this.saturdayForm.controls["isChecked"].reset();
          this.sundayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.mondayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.tuesdayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.wednesdayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.thursdayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.fridayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.saturdayForm.setControl(
            "arrayOfTimings",
            this.formBuilder.array([])
          );
          this.addSundayTimings();
          this.addMondayTimings();
          this.addTuesdayTimings();
          this.addWednesdayTimings();
          this.addThursdayTimings();
          this.addFridayTimings();
          this.addSaturdayTimings();
        }
      });
  }

  onDateChange(event) {
    this.min = event;
  }

  enableRestOfForm(event) {
    for (let i = 0; i < this.specialistLocations.length; i++) {
      if (event.value == this.specialistLocations[i]._id) {
        this.lat = this.specialistLocations[i].location
          ? this.specialistLocations[i].location.lat
          : 0;
        this.long = this.specialistLocations[i].location
          ? this.specialistLocations[i].location.lng
          : 0;
        //this.timezone = tzlookup(this.lat, this.long);
      }
    }
    // this.getSpecialistAvailability();
  }

  owlDateFormat(dateToFormat, timezone) {
    let _date = moment(dateToFormat);
    let Day = parseInt(_date.format("D"));
    let Month = parseInt(_date.format("M"));
    let Year = parseInt(_date.format("YYYY"));
    let Hour = parseInt(_date.format("HH"));
    let Min = parseInt(_date.format("mm"));

    let finalDate = new Date(Year, Month - 1, Day, Hour, Min);

    return finalDate;
  }

  onDaySelectChange(event, day) {
    if (event.checked) {
      if (day == "monday") {
        this.mondayForm.controls["arrayOfTimings"].reset();
        this.mondayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addMondayTimings();
        this.showMondayPlusBtn = true;
      }
      if (day == "tuesday") {
        this.tuesdayForm.controls["arrayOfTimings"].reset();
        this.tuesdayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addTuesdayTimings();
        this.showTuesdayPlusBtn = true;
      }
      if (day == "wednesday") {
        this.wednesdayForm.controls["arrayOfTimings"].reset();
        this.wednesdayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addWednesdayTimings();
        this.showWednesdayPlusBtn = true;
      }
      if (day == "thursday") {
        this.thursdayForm.controls["arrayOfTimings"].reset();
        this.thursdayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addThursdayTimings();
        this.showThursdayPlusBtn = true;
      }
      if (day == "friday") {
        this.fridayForm.controls["arrayOfTimings"].reset();
        this.fridayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addFridayTimings();
        this.showFridayPlusBtn = true;
      }
      if (day == "saturday") {
        this.saturdayForm.controls["arrayOfTimings"].reset();
        this.saturdayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addSaturdayTimings();
        this.showSaturdayPlusBtn = true;
      }
      if (day == "sunday") {
        this.sundayForm.controls["arrayOfTimings"].reset();
        this.sundayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addSundayTimings();
        this.showSundayPlusBtn = true;
      }
    } else {
      if (day == "monday") {
        this.mondayForm.controls["arrayOfTimings"].reset();
        this.mondayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addMondayTimings();
        this.mondayForm.controls["arrayOfTimings"].disable();
        this.showMondayPlusBtn = false;
      }
      if (day == "tuesday") {
        this.tuesdayForm.controls["arrayOfTimings"].reset();
        this.tuesdayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addTuesdayTimings();
        this.tuesdayForm.controls["arrayOfTimings"].disable();
        this.showTuesdayPlusBtn = false;
      }
      if (day == "wednesday") {
        this.wednesdayForm.controls["arrayOfTimings"].reset();
        this.wednesdayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addWednesdayTimings();
        this.wednesdayForm.controls["arrayOfTimings"].disable();
        this.showWednesdayPlusBtn = false;
      }
      if (day == "thursday") {
        this.thursdayForm.controls["arrayOfTimings"].reset();
        this.thursdayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addThursdayTimings();
        this.thursdayForm.controls["arrayOfTimings"].disable();
        this.showThursdayPlusBtn = false;
      }
      if (day == "friday") {
        this.fridayForm.controls["arrayOfTimings"].reset();
        this.fridayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addFridayTimings();
        this.fridayForm.controls["arrayOfTimings"].disable();
        this.showFridayPlusBtn = false;
      }
      if (day == "saturday") {
        this.saturdayForm.controls["arrayOfTimings"].reset();
        this.saturdayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addSaturdayTimings();
        this.saturdayForm.controls["arrayOfTimings"].disable();
        this.showSaturdayPlusBtn = false;
      }
      if (day == "sunday") {
        this.sundayForm.controls["arrayOfTimings"].reset();
        this.sundayForm.setControl(
          "arrayOfTimings",
          this.formBuilder.array([])
        );
        this.addSundayTimings();
        this.sundayForm.controls["arrayOfTimings"].disable();
        this.showSundayPlusBtn = false;
      }
    }
  }

  UpdateCheck(data) {
    console.log("DATA", data);
    this.isEdit = true;
    this.specialistAvailability = data;
    this.sundayForm.controls["isChecked"].reset();
    this.mondayForm.controls["isChecked"].reset();
    this.tuesdayForm.controls["isChecked"].reset();
    this.wednesdayForm.controls["isChecked"].reset();
    this.thursdayForm.controls["isChecked"].reset();
    this.fridayForm.controls["isChecked"].reset();
    this.saturdayForm.controls["isChecked"].reset();
    this.sundayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.mondayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.tuesdayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.wednesdayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.thursdayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.fridayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.saturdayForm.setControl("arrayOfTimings", this.formBuilder.array([]));
    this.addSundayTimings();
    this.addMondayTimings();
    this.addTuesdayTimings();
    this.addWednesdayTimings();
    this.addThursdayTimings();
    this.addFridayTimings();
    this.addSaturdayTimings();
    this.setAvailabilityForm.patchValue({
      specialDate: this.owlDateFormat(
        this.specialistAvailability.specialOfferDate,
        this.specialistAvailability.availTimeZone
      ), //moment.tz(this.specialistAvailability.fromDateTime, this.specialistAvailability.availTimeZone).format()
      startDate: this.owlDateFormat(
        this.specialistAvailability.fromDateTime,
        this.specialistAvailability.availTimeZone
      ), //moment.tz(this.specialistAvailability.fromDateTime, this.specialistAvailability.availTimeZone).format()
      endDate: this.owlDateFormat(
        this.specialistAvailability.toDateTime,
        this.specialistAvailability.availTimeZone
      ), //moment.tz(this.specialistAvailability.endDate, this.specialistAvailability.availTimeZone).format(),
      //location: this.specialistAvailability.location_id,
      duration: this.specialistAvailability.duration,
    });
    if (
      this.specialistAvailability.available_days &&
      this.specialistAvailability.available_days.length
    ) {
      for (
        let i = 0;
        i < this.specialistAvailability.available_days.length;
        i++
      ) {
        if (this.specialistAvailability.available_days[i].id == 0) {
          this.sundayForm.patchValue({
            isChecked: this.specialistAvailability.available_days[i].isChecked
              ? this.specialistAvailability.available_days[i].isChecked
              : false,
          });
          this.loadMultipleSundays(
            this.specialistAvailability.available_days[i].arrayOfTimings
          );
        }

        if (this.specialistAvailability.available_days[i].id == 1) {
          this.mondayForm.patchValue({
            isChecked: this.specialistAvailability.available_days[i].isChecked
              ? this.specialistAvailability.available_days[i].isChecked
              : false,
          });
          this.loadMultipleMondays(
            this.specialistAvailability.available_days[i].arrayOfTimings
          );
        }

        if (this.specialistAvailability.available_days[i].id == 2) {
          this.tuesdayForm.patchValue({
            isChecked: this.specialistAvailability.available_days[i].isChecked
              ? this.specialistAvailability.available_days[i].isChecked
              : false,
          });
          this.loadMultipleTuesdays(
            this.specialistAvailability.available_days[i].arrayOfTimings
          );
        }
        if (this.specialistAvailability.available_days[i].id == 3) {
          this.wednesdayForm.patchValue({
            isChecked: this.specialistAvailability.available_days[i].isChecked
              ? this.specialistAvailability.available_days[i].isChecked
              : false,
          });
          this.loadMultipleWednesdays(
            this.specialistAvailability.available_days[i].arrayOfTimings
          );
        }
        if (this.specialistAvailability.available_days[i].id == 4) {
          this.thursdayForm.patchValue({
            isChecked: this.specialistAvailability.available_days[i].isChecked
              ? this.specialistAvailability.available_days[i].isChecked
              : false,
          });
          this.loadMultipleThursdays(
            this.specialistAvailability.available_days[i].arrayOfTimings
          );
        }
        if (this.specialistAvailability.available_days[i].id == 5) {
          this.fridayForm.patchValue({
            isChecked: this.specialistAvailability.available_days[i].isChecked
              ? this.specialistAvailability.available_days[i].isChecked
              : false,
            arrayOfTimings: this.specialistAvailability.available_days[i]
              .arrayOfTimings,
          });
          this.loadMultipleFridays(
            this.specialistAvailability.available_days[i].arrayOfTimings
          );
        }
        if (this.specialistAvailability.available_days[i].id == 6) {
          this.saturdayForm.patchValue({
            isChecked: this.specialistAvailability.available_days[i].isChecked
              ? this.specialistAvailability.available_days[i].isChecked
              : false,
          });
          this.loadMultipleSaturdays(
            this.specialistAvailability.available_days[i].arrayOfTimings
          );
        }
      }
    }
  }
}

// moment.utc("2016-06-12 06:22:18", "YYYY-MM-DD HH:mm:ss").tz('America/Chicago').format("MMM D, YYYY, hh:mm a")
