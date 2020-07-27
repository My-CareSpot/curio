import { Component, OnInit } from "@angular/core";
import { LocalService } from "src/app/local.service";
import { CommonService } from "src/app/common.service";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-videocallnotification",
  templateUrl: "./videocallnotification.component.html",
  styleUrls: ["./videocallnotification.component.scss"],
})
export class VideocallnotificationComponent implements OnInit {
  userData: any;
  user_id: any;
  notificationList: any;
  constructor(
    private localServ: LocalService,
    private comonServ: CommonService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.getVideoCallNotifications();
  }

  getVideoCallNotifications() {
    let dataToSend = {
      hospital_user_id: this.userData._id,
    };
    this.comonServ
      .getVideoCallNotification(dataToSend)
      .subscribe((data: any) => {
        if (data.code === 200) {
          this.notificationList = data["data"]["data"];
          console.log(this.notificationList);
        }
      });
  }

  markAsRead(data) {
    let dataToPass = {
      _id: data._id,
    };
    this.comonServ.markAsRead(dataToPass).subscribe((data: any) => {
      if (data.code === 200) {
        this.router.navigate(["dashboard/booking-list"]);
        this.getVideoCallNotifications();
      } else if (data.code === 400) {
      }
    });
  }
}
