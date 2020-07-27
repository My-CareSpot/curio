import { Component, OnInit, IterableDiffers } from "@angular/core";
import { LocalService } from "src/app/local.service";
import { Subscription, timer, Observable, of, from } from "rxjs";
import {
  switchMap,
  windowTime,
  observeOn,
  distinctUntilChanged,
} from "rxjs/operators";
import { CommonService } from "src/app/common.service";
import { environment } from "../../../environments/environment";
import * as io from "socket.io-client";
import * as moment from "moment-timezone";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  differ: any;
  socketUrl: any = environment.socketUrl;
  audio: any;
  myMoment: moment;
  socket: any;
  constructor(
    private localServ: LocalService,
    private commonServ: CommonService,
    private router: Router,
    private differs: IterableDiffers
  ) {
    this.differ = differs.find([]).create(null);
    // this.socket = io(this.socketUrl,{reconnect:true});
    this.socket = io(this.socketUrl);

  }
  isMissCallNotification: boolean = false;
  isVideoCallNotification: boolean = false;
  videoCalLength: any = 0;
  atTime: any;
  tempMissCall: any = 0;
  missCallData: any;
  missCallAllData: any;
  videoCallAllData: any;
  subscription: Subscription;
  hospita_user_id: any = "hospital_user_id";
  videoCallData: any;
  dashboardPageName = "";
  userData: any;
  isCallDeclined: boolean;
  declineMessage: any;
  user_id: any;
  missCallLength: any = 0;

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;

    let dataToPass = {
      fromWhom: "hospital_user_id",
      from: this.user_id,
    };
    // this.getMissCallNotification();
    // this.getVideocCallNotification();

    this.socket.on("declinedcall", function (data) {
      this.isCallDeclined = true;
      this.declineMessage = data;
      console.log("data", data);
    });

    this.socket.on("misscallnotification", () => {
      this.isMissCallNotification = true;
      this.getMissCallNotification();
    });
    this.socket.on("videocall", () => {
      this.isVideoCallNotification = true;
      if (this.isVideoCallNotification) {
        this.playAudio();
      } else {
        this.audio.pause();
        this.audio = null;
      }

      this.getVideocCallNotification();
    });
  }
  declineVideoCall() {
    this.isVideoCallNotification = false;
    this.audio.pause();
    this.audio == null;
    let dataToPass = {
      appointment_request_id: this.videoCallData.appointment_request_id,
    };
    this.commonServ.doctorDeclinedCall(dataToPass).subscribe((data: any) => {
      if (data.code === 200) {
        console.log("call declined");
      }
    });
  }
  closeMissCall() {
    this.isMissCallNotification = false;
    this.isCallDeclined = false;
  }

  playAudio() {
    this.audio = new Audio();
    this.audio.src =
      "https://careportal.curio-dtx.com/upload/0.6311561732843582tring-tring-tring-9014.mp3";
    this.audio.load();
    this.audio.play();
  }

  acceptVideoCall() {
    this.isVideoCallNotification = false;
    this.audio.pause();
    this.audio == null;
    this.commonServ.setAppointmentData(this.videoCallData);
    sessionStorage.setItem("hexacode", JSON.stringify(this.videoCallData));
    this.router.navigate(["dashboard/consult"]);
  }

  getVideocCallNotification() {
    let dataToSend = {
      hospital_user_id: this.userData._id,
    };

    this.commonServ
      .getVideoCallNotification(dataToSend)
      .subscribe((data: any) => {
        console.log("DATA", data);
        this.videoCallData = data["data"]["data"][0];
        console.log(this.videoCallData);
      });
  }

  getMissCallNotification() {
    let dataToPass = {
      fromWhom: "hospital_user_id",
      from: this.user_id,
    };
    this.commonServ
      .getMissCallNotification(dataToPass)
      .subscribe((data: any) => {
        this.missCallData = data["data"][0];
        console.log(this.missCallData);
        this.atTime = moment
          .utc(this.missCallData.createdAt)
          .tz("America/New_York")
          .format("HH:mm A");
        console.log("daat", data);
      });
  }
}
