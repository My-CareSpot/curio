import { Component, OnInit, Inject } from "@angular/core";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
//import { GenralService } from '../../../../core';
import { CalendarsettingService } from "../services/calendarsetting.service";
import { ToastrService } from "ngx-toastr";
//import { WebLocalStorage } from '../../../../core/web.storage';
import * as moment from "moment-timezone";
//import { genralConfig } from '../../../../core/constant/genral-config.constant';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import interaction from "@fullcalendar/interaction";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import Tooltip from "tooltip.js";
import { LocalService } from "src/app/local.service";
import { CommonService } from "src/app/common.service";
import { Local } from "protractor/built/driverProviders";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit {
  calendarPlugins = [dayGridPlugin, timeGridPlugin];
  calendarElement: any;
  selectCareTakerForm: FormGroup;
  calendar: any;
  calendarOptions: any;
  loader: boolean = false;
  loggedInUserDetails: any;
  locationCount: any = 10;
  tempCareTaker_id: any;
  temCareTaker_care_id: any;
  locationPage = 1;
  specialistLocations: any = [];
  location = new FormControl();
  eventData: any = [];
  isftcr: boolean = true;
  currentEnd: any;
  currentStart: any;
  calType: any;
  startTime: any;
  endTime: any;
  availableDays: any = [];
  days: any = [];
  appointmentData: any = [];
  appointmentData1: any = [];
  start: any;
  color: any;
  doctorList: any;
  constructor(
    public router: Router,
    //public _genralServices: GenralService,
    private _calendarSettingService: CalendarsettingService,
    private fromB: FormBuilder,
    private toastr: ToastrService,
    //private _webStorage: WebLocalStorage,
    private dialog: MatDialog,
    private localServ: LocalService,
    private comService: CommonService
  ) {
    this.calendarOptions = {
      slotDuration: "00:15:00",
      navLinks: true,
      editable: false,
      eventLimit: false,
      allDaySlot: true,
      displayEventTime: true,
      header: {
        left: "title",
        center: "prev,next today",
        // right: 'dayGridMonth,timeGridWeek,timeGridDay'
        right: "timeGridDay,timeGridWeek,dayGridMonth",
      },
      businessHours: this.availableDays, //true,//this.availableDays,
      plugins: [interaction, dayGridPlugin, timeGridPlugin],
      timeFormat: "H:mm",
      selectable: true,
      events: this.eventData,
      datesRender: (info) => {
        //this.fetchAvailibility();
        console.log("INFO", info);
        this.currentEnd = moment(info.view.currentEnd).utc(); //.set({ second: 0 })
        this.currentStart = moment(info.view.currentStart).utc(); //.set({ second: 0 })
        this.calType = info.view.viewSpec.singleUnit;

        console.log("this.cureentendstartSIR", this.calType);

        if (this.isftcr) {
          this.isftcr = false;
        } else {
          this.getSpecialistAppointment(
            this.calType,
            this.currentStart,
            this.currentEnd
          );
        }
      },

      eventRender: function (info) {
        var tooltip = new Tooltip(info.el, {
          title: info.event.extendedProps.description,
          placement: "top",
          trigger: "hover",
          container: "body",
        });
      },

      //FOR date click event start
      dateClick: function (info) {
        console.log("INFOC", info);
        console.log("Clicked on: " + info.dateStr);
        console.log(
          "Coordinates: " + info.jsEvent.pageX + "," + info.jsEvent.pageY
        );
        console.log("Current view: " + info.view.type);
        // change the day's background color just for fun
        //info.dayEl.style.backgroundColor = 'red';
      },
      //end

      navLinkDayClick: (date, jsEvent) => {
        console.log("DATECHANGEEEEEEEEEEEEEEEEEEE", date, jsEvent);
        this.calendar.changeView("timeGridDay", date);
      },
      eventClick: (eventClickInfo) => {
        console.log("DATECHANGEEEEEEEEEEEWWWWWWWWWWWWWWWWWWWWWWWWW");
        if (eventClickInfo.event.extendedProps.appointment_type == "Normal") {
          //this.router.navigate(['/layout/specialist/view-appointment/' + eventClickInfo.event.id]);
        }
      },
      select: (info) => {
        this.openSetUnavailabilityPopup(info);
      },
    };
  }

  fetchAvailibility() {
    this.getSpecialistAvailability(this.tempCareTaker_id);
  }

  ngOnInit() {
    //this.loggedInUserDetails = this._webStorage.get('all');
    this.loggedInUserDetails = JSON.parse(this.localServ.getJsonValue("user"));
    // this.listSpecialistLocations();

    this.renderCalendar();
    this.getList();
    this.getSpecialistAppointment(
      this.calType,
      this.currentStart,
      this.currentEnd
    );

    this.selectCareTakerForm = this.fromB.group({
      specialist_id: [""],
    });

    this.selectCareTakerForm
      .get("specialist_id")
      .valueChanges.subscribe((data: any) => {
        console.log("INSIDE DATA", data);
        this.tempCareTaker_id = data.caretaker_user_id;
        this.temCareTaker_care_id = data.caretaker_id;
        this.getSpecialistAvailability(this.tempCareTaker_id);
      });
  }

  goBack() {
    //this._genralServices.goBack();
  }

  // listSpecialistLocations() {
  //   //this.loader = true;
  //   let listObj = {
  //     count: this.locationCount ? this.locationCount : '',
  //     page: this.locationPage ? this.locationPage : '',
  //     //specialist_id: this.loggedInUserDetails._id,
  //     user_id: this.loggedInUserDetails._id
  //   }
  //   this._calendarSettingService.listSpecialistLocations(listObj).subscribe((res: any) => {
  //     this.loader = false;
  //     if (res && res.code == genralConfig.statusCode.ok && res.data) {
  //       this.specialistLocations = res.data;
  //       if (res.data.length > 0) {
  //         this.location.setValue(res.data[0]._id)
  //       }
  //       // console.log("res location----------------", res.data);
  //     }
  //     else {
  //       this.toastr.warning(res.message);
  //     }
  //     this.getSpecialistAvailability();
  //     this.getSpecialistAppointment();
  //   })
  // }

  getSpecialistAppointment(type?, startDate?, endDate?) {
    let startOfMonth, endOfMonth, isMonth;
    if (this.isftcr) {
      startOfMonth = moment().startOf("month").utc();
      endOfMonth = moment().endOf("month").utc();
      startOfMonth.set({ second: 0 });
      endOfMonth.set({ second: 0 });
      isMonth = true;
    } else {
      if (type == "month") {
        isMonth = true;
      } else {
        isMonth = false;
      }
    }
    let dataObj = {
      isMonth: isMonth,
      //specialist_id: this.loggedInUserDetails._id,
      user_id: this.tempCareTaker_id,
      startDate: startDate ? startDate : startOfMonth,
      endDate: endDate ? endDate : endOfMonth,
      //location_id: this.location.value,
    };
    this.comService.getCareAppointment(dataObj).subscribe((data: any) => {
      if (data.code === 200) {
        console.log("DATAAAAAAAAAAAAAAAAA", data);
        this.appointmentData = data.data;
        if (this.appointmentData.length > 0) {
          this.appointmentData.forEach((element) => {
            let aptDate = new Date(element.appointment_date).getDate();
            let startTime = new Date(element.appointment_time).setDate(aptDate);
            let endTime = new Date(element.appointment_end_time).setDate(
              aptDate
            );

            this.calendarOptions.events.push({
              title: element.patient_name,
              start: new Date(startTime),
              end: new Date(endTime),
              backgroundColor: element.color,
              appointment_id: element.appointment_request_id,
            });
          });
          if (this.isftcr) {
            this.renderCalendar();
          } else {
            this.calendar.removeAllEventSources();
            this.calendar.addEventSource(this.eventData);
            this.calendar.rerenderEvents();
          }
        } else if (this.appointmentData.length === 0) {
          console.log("ZEROOOOOOOOOOOOOOOOOO");

          this.calendarOptions.events = [];
          this.calendarOptions.businessHours = [];
          console.log("CALNEDAROPTIONS", this.calendarOptions);
          if (this.isftcr) {
            this.renderCalendar();
          } else {
            this.calendar.removeAllEventSources();
            this.calendar.addEventSource(this.eventData);
            this.calendar.rerenderEvents();
          }
        }
      }
    });

    this.calendarOptions.events = this.eventData;
  }

  // onLocationChange() {
  //   this.getSpecialistAvailability();
  //   if (this.calendar)
  //     this.getSpecialistAppointment(this.calType, this.currentStart, this.currentEnd);
  // }

  renderCalendar() {
    console.log("CALENDER", this.calendar);

    if (this.calendar) this.calendar.destroy();
    this.calendarElement = document.getElementById("calendar")!;
    console.log("CALENDAROPTION", this.calendarOptions);
    this.calendar = new Calendar(this.calendarElement, this.calendarOptions);
    console.log("CALENDERWWWWWWW", this.calendar);
    this.calendar.render();
  }

  getSpecialistAvailability(data) {
    //this.loader = true;
    let getObj = {
      user_id: data,
      startDate: this.currentStart,
      endDate: this.currentEnd,
      //location_id: this.location.value
    };
    this.comService
      .getCareTakerAvailibilities(getObj)
      .subscribe(async (res: any) => {
        console.log("RESULT", res.data[0]);
        this.loader = false;
        if (res && res.code == 200 && res.data[0]) {
          let localTimeZone = moment.tz.guess();
          this.startTime = moment
            .tz(res.data[0].fromDateTime, localTimeZone)
            .format("HH:mm");
          this.endTime = moment
            .tz(res.data[0].toDateTime, localTimeZone)
            .format("HH:mm");
          this.availableDays = [];
          this.days = res.data[0].available_days;
          if (res.data[0].available_days.length) {
            for (let i = 0; i < res.data[0].available_days.length; i++) {
              for (
                let j = 0;
                j < res.data[0].available_days[i].arrayOfTimings.length;
                j++
              ) {
                if (res.data[0].available_days[i].isChecked) {
                  this.availableDays.push({
                    daysOfWeek: [res.data[0].available_days[i].id],
                    startTime: await this.createBusinessHours(
                      res.data[0].available_days[i].arrayOfTimings[j].startTime
                    ),
                    endTime: await this.createBusinessHours(
                      res.data[0].available_days[i].arrayOfTimings[j].endTime
                    ),
                  });
                }
              }
            }
          }
          this.calendarOptions.businessHours = this.availableDays;
          this.renderCalendar();
          // this.calendarOptions.slotDuration =this.slotD
          // this.calendarElement = document.getElementById('calendar');
          // this.calendar = new Calendar(this.calendarElement, this.calendarOptions);
          // console.log("this.date.value",this.date.value)
          // this.calendar.gotoDate(this.date.value)
          this.calendar.render();
        } else {
          this.availableDays = [];
          this.toastr.warning(res.message);
          this.calendar.destroy();
        }
      });
  }

  createBusinessHours(date) {
    return new Promise((resolve, reject) => {
      let time = moment(date).format("HH:mm");
      resolve(time);
    });
  }

  getList() {
    let obj = {
      hospital_id: this.loggedInUserDetails._id,
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

  openSetUnavailabilityPopup(info) {
    // let csTime = this.startTime;
    // let ceTime = this.endTime;
    let sDate = info.start;
    let eDate = info.end;
    let sTime = moment(sDate).format("HH:mm");
    let eTime = moment(eDate).format("HH:mm");
    let dow = moment(sDate).day();
    info.caretaker_id = this.tempCareTaker_id;

    let arr = this.checkForAvilableDays(dow);
    arr.forEach((element) => {
      if (element && element.isExec) {
        let isEnter = true;
        element.arrayOfTimings.forEach((item, index) => {
          if (sTime >= item.startTime && eTime <= item.endTime && isEnter) {
            isEnter = false;
            this.openDialog(info);
          } else {
            this.calendar.changeView("timeGridDay", sDate);

            // if ((element.arrayOfTimings.length - 1) == index && isEnter) {
            //   this.toastr.warning(`You are already unavailable`);
            // }
          }
        });
      } else {
        this.toastr.warning(`You are already unavailable`);
      }
    });

    // for(let i=0;i<arr.length;i++){
    //   if(arr[i].isExec){
    //     for(let j=0;j<arr[i].arrayOfTimings.length;j++){
    //       if(sTime>=arr[i].arrayOfTimings[j].startTime){
    //         if(eTime<=arr[i].arrayOfTimings[j].endTime){
    //           this.openDialog(info);
    //           break;
    //         }else{
    //           this.toastr.warning(`You are already unavailable`);
    //           break;
    //         }
    //       }else{
    //         this.toastr.warning(`You are already unavailable`);
    //         break;
    //       }
    //     }
    //   }else{
    //     this.toastr.warning(`You are already unavailable`);
    //   }
    // }
    // if(){
    //   // console.log("inside if===========");
    //   if (sTime >= csTime){
    //     if(eTime <= ceTime){
    //       console.log("here=========================")
    //       this.openDialog(info)
    //     }else{
    //       this.toastr.warning(`You are already unavailable`);
    //     }
    //   }else{
    //     this.toastr.warning(`You are already unavailable`);
    //   }
    // }else{
    //   this.toastr.warning("You are already unavailable");
    // }
  }

  checkForAvilableDays(day) {
    let tempArr = [];
    let tempArrayOfTimings = [];
    let days = this.availableDays;
    days.filter((element) => {
      if (element.daysOfWeek[0] == day) {
        tempArrayOfTimings.push({
          startTime: element.startTime,
          endTime: element.endTime,
        });
        let obj = {
          isExec: true,
          arrayOfTimings: tempArrayOfTimings,
        };
        tempArr.push(obj);
      }
    });
    return [tempArr[0]];
  }

  openDialog(info) {
    console.log("INFOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", info);
    let sDate = info.startStr;
    let eDate = info.endStr;
    let sTime = info.startStr;
    let eTime = info.endStr;
    let date = info.start;
    const dialogRef = this.dialog.open(UnavailabilityDialog, {
      width: "800px",
      data: {
        date: date,
        sTime: sTime,
        caretaker_id: this.temCareTaker_care_id,
        eTime: eTime,
        availableDays: this.days,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //this.loader = true;

        let obj = {
          appointment_date: sDate,
          startDateTime: sDate,
          endDateTime: eDate,
          //specialist_id: this.loggedInUserDetails._id,
          updated_by: this.loggedInUserDetails._id,

          appointment_type: result.unavailabilityType
            ? result.unavailabilityType
            : "",
          //location_id: this.location.value,
          isRepeat: result.isRepeat ? result.isRepeat : false,
          repeatType: result.repeatType ? result.repeatType : "",
          noOfWeeks: result.noOfWeeks ? result.noOfWeeks : 0,
          weeklyEndDate: result.weeklyEndDate ? result.weeklyEndDate : "",
          dailyEndDate: result.dailyEndDate ? result.dailyEndDate : "",
          week: result.week ? result.week : [],
        };
        //console.log("obj================", obj);
        // this._calendarSettingService.bookAppointment(obj).subscribe((res: any) => {
        //   this.loader = false;
        //   if (res && res.code == 200) {
        //     this.toastr.success(res.message);
        //   } else {
        //     this.toastr.error(res.message);
        //   }
        //   // this.getSpecialistAppointment();
        // })
      }
    });
  }
}

@Component({
  selector: "app-unavailability-dialog",
  templateUrl: "./unavailability-dialog.html",
  styleUrls: ["./calendar.component.scss"],
})
export class UnavailabilityDialog implements OnInit {
  weekData = [
    {
      id: 0,
      name: "Sunday",
      isChecked: false,
      arrayOfTimings: [],
      isDisable: false,
    },
    {
      id: 1,
      name: "Monday",
      isChecked: false,
      arrayOfTimings: [],
      isDisable: false,
    },
    {
      id: 2,
      name: "Tuesday",
      isChecked: false,
      arrayOfTimings: [],
      isDisable: false,
    },
    {
      id: 3,
      name: "Wednesday",
      isChecked: false,
      arrayOfTimings: [],
      isDisable: false,
    },
    {
      id: 4,
      name: "Thursday",
      isChecked: false,
      arrayOfTimings: [],
      isDisable: false,
    },
    {
      id: 5,
      name: "Friday",
      isChecked: false,
      arrayOfTimings: [],
      isDisable: false,
    },
    {
      id: 6,
      name: "Saturday",
      isChecked: false,
      arrayOfTimings: [],
      isDisable: false,
    },
  ];
  types = ["Unavailability", "Appointment"];
  repeatTypes = ["Daily", "Weekly"];
  typeSelected: any;
  date = this.data.date;
  sTime = this.data.sTime;
  caretaker_id = this.data.caretaker_id;
  eTime = this.data.eTime;
  unavailabilityForm: FormGroup;
  bookAppointmentForm: FormGroup;
  isBookApp: boolean;
  showRepeatTypes: boolean = false;
  showDailyEndDate: boolean = false;
  showInputs: boolean = false;
  appointmentId: any;
  patientList: any;
  loggedInUserDetails: any;
  days = this.data.availableDays;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UnavailabilityDialog>,
    private commonServ: CommonService,
    private localServ: LocalService,
    private toastServ: ToastrService
  ) {}

  ngOnInit() {
    this.loggedInUserDetails = JSON.parse(this.localServ.getJsonValue("user"));
    this.getPatients();
    this.unavailabilityForm = this.formBuilder.group({
      unavailabilityType: ["", [Validators.required]],
      isRepeat: [false, [Validators.required]],
      repeatType: [""],
      noOfWeeks: [""],
      endDate: [""],
      week: this.formBuilder.array([]),
    });

    this.bookAppointmentForm = this.formBuilder.group({
      patient_user_id: ["", Validators.required],
      caretaker_id: this.caretaker_id,
      appointment_request_id: [""],
      appointment_date: this.date,
      appointment_time: this.sTime,
      appointment_end_time: this.eTime,
    });
    this.addCheckboxes();
    this.unavailabilityForm
      .get("unavailabilityType")
      .valueChanges.subscribe((data: any) => {
        console.log("TYPEEEEEEEEEEEE", data);
        this.typeSelected = data;
        if (this.typeSelected === "Appointment") {
          this.isBookApp = true;
          console.log("Call patieints");
        }
      });
  }

  bookAppointment() {
    this.bookAppointmentForm
      .get("appointment_request_id")
      .setValue(this.appointmentId);
    this.commonServ
      .bookAppointment(this.bookAppointmentForm.value)
      .subscribe((data: any) => {
        if (data.code === 200) {
          this.toastServ.success("Appointment Booked", "", {
            timeOut: 1000,
          });
          this.dialogRef.close();
        } else if (data.code === 400) {
          this.toastServ.error("Failed to Book", "Appointment", {
            timeOut: 1000,
          });
        }
      });
  }

  onRepeatChange(event) {
    if (event.checked) {
      this.showRepeatTypes = true;
      this.unavailabilityForm.controls["repeatType"].setValidators([
        Validators.required,
      ]);
      this.unavailabilityForm.controls["repeatType"].updateValueAndValidity();
    } else {
      this.showRepeatTypes = false;
      this.unavailabilityForm.controls["repeatType"].clearValidators();
      this.unavailabilityForm.controls["repeatType"].updateValueAndValidity();
    }
  }

  getPatients() {
    let dataToPass = {
      user_id: this.loggedInUserDetails._id,
      userType: this.loggedInUserDetails.userType,
    };

    this.commonServ.getPatientList(dataToPass).subscribe((data: any) => {
      this.patientList = data.data;
      console.log("PATIENT:OST", this.patientList);
    });
  }

  onRepeatTypeChange(event) {
    this.showInputs = true;
    if (event.value == "Daily") {
      this.weekData.forEach((item) => {
        item.isDisable = true;
      });
    } else {
      this.weekData.forEach((item) => {
        if (item.arrayOfTimings.length == 0) {
          item.isDisable = true;
        } else {
          item.isDisable = false;
        }
      });
    }
  }

  addCheckboxes() {
    this.days.forEach((element) => {
      this.weekData.forEach((item) => {
        if (element.id == item.id && element.isChecked) {
          item.isChecked = true;
          item.arrayOfTimings = element.arrayOfTimings;
        }
      });
    });
    this.weekData.forEach((o, i) => {
      const control = new FormControl(o.isChecked); // if first item set to true, else false
      (this.unavailabilityForm.controls.week as FormArray).push(control);
    });
  }

  onNumberOfWeekChange(event) {
    let dow = moment(this.date).day();
    let arr = this.days.map((a) => a.id);
    var lastEle = arr[arr.length - 1];
    let numWeeks = event;
    let now = new Date(this.date);
    if (dow == lastEle) {
      now.setDate(now.getDate() + numWeeks * 7);
    } else {
      now.setDate(now.getDate() + numWeeks * 7 + (lastEle - dow));
    }
    this.unavailabilityForm.patchValue({
      endDate: now,
    });
  }

  onDaySelect(event) {
    let setValue = this.unavailabilityForm.value.week;
    this.weekData.forEach((item, i) => {
      item.isChecked = setValue[i];
    });
    let tempArr = [];
    this.weekData.forEach((item) => {
      if (item.isChecked) {
        tempArr.push(item.id);
      }
    });
    let dow = moment(this.date).day();
    var lastEle = tempArr[tempArr.length - 1];
    let numWeeks = this.unavailabilityForm.value.noOfWeeks;
    let now = new Date(this.date);
    if (dow == lastEle) {
      now.setDate(now.getDate() + numWeeks * 7);
    } else {
      now.setDate(now.getDate() + numWeeks * 7 + (lastEle - dow));
    }
    this.unavailabilityForm.patchValue({
      weeklyEndDate: now,
    });
  }

  bookUnavailability() {
    let setValue = this.unavailabilityForm.value.week;
    this.weekData.forEach((item, i) => {
      item.isChecked = setValue[i];
    });
    let tempArr = [];
    this.weekData.forEach((item) => {
      if (item.isChecked) {
        tempArr.push(item.id);
      }
    });
    let obj = {
      unavailabilityType: this.unavailabilityForm.value.unavailabilityType,
      isRepeat: this.unavailabilityForm.value.isRepeat,
      repeatType: this.unavailabilityForm.value.repeatType,
      endDate: this.unavailabilityForm.value.endDate,
      noOfWeeks: this.unavailabilityForm.value.noOfWeeks,
      week: tempArr,
    };
    this.dialogRef.close(obj);
  }
}
