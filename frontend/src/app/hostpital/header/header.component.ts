import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { AuthService } from "src/app/auth.service";

import { Subscription, timer, Observable } from "rxjs";
import { switchMap, windowTime } from "rxjs/operators";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";

import { environment } from "../../../environments/environment";
import * as io from "socket.io-client";
import * as moment from "moment-timezone";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  k;

  userRoleId = 0;
  isShow: boolean;
  notificationList: any;
  notificationNumber: any = 0;
  subscription: Subscription;
  socketUrl: any = environment.socketUrl;
  socket: any;

  videoCallNotifications: any;
  videoCallNotificationLength: any = 0;

  isShowNoti: boolean = false;

  userData: any;

  title = "integrated-eHealth-Solutions";

  toggleSidebar() {
    document
      .getElementsByTagName("body")[0]
      .classList.toggle("collapsedSidebar");
    const windowWidth = window.innerWidth;
    if (
      document
        .getElementsByTagName("body")[0]
        .classList.contains("collapsedSidebar") &&
      windowWidth < 768
    ) {
      var elem = document.getElementById("overlayID");
      elem.parentNode.removeChild(elem);
    } else {
      if (windowWidth < 768) {
        const elem = document.createElement("div");
        elem.className = "sidebar-overlay";
        elem.id = "overlayID";
        elem.onclick = function () {
          var elem = document.getElementById("overlayID");
          elem.parentNode.removeChild(elem);
          document
            .getElementsByTagName("body")[0]
            .classList.toggle("collapsedSidebar");
        };
        document.body.appendChild(elem);
      }
    }
  }

  constructor(
    private router: Router,
    private localServ: LocalService,
    private commonServ: CommonService,
    private toastServ: ToastrService,
    private authServ: AuthService // private localStorageService: LocalStorageService, // private notifierService: NotificationService
  ) {
    // this.userRoleId = parseInt(this.localStorageService._getUserRoleId().toString());
    this.socket = io(this.socketUrl);
  }

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));

    let dataToPass = {
      type: "notification",
      user_id: this.userData._id,
    };

    let dataToSend = {
      hospital_user_id: this.userData._id,
    };
    this.getVideoCallNotification();
    this.socket.on("videocallnotification", () => {
      console.log("INSIDEHEADER");
      this.getVideoCallNotification();
    });

    const dynamicScripts = ["../../../../assets/js/sidebar.js"];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement("script");
      node.src = dynamicScripts[i];
      node.type = "text/javascript";
      node.async = false;
      node.charset = "utf-8";
      document.getElementsByTagName("head")[0].appendChild(node);
      node.onload = function () {};
    }
  }

  toggleSearch() {
    document
      .getElementsByTagName("body")[0]
      .classList.toggle("searchBarExpanded");
  }

  readNotification(data) {
    let dataToPass = {
      notification_id: data._id,
    };
    this.commonServ.readNotify(dataToPass).subscribe(
      (data: any) => {
        if (data.code === 200) {
          let dataToPass = {
            type: "notification",
            user_id: this.userData._id,
          };
          this.commonServ
            .getNotifications(dataToPass)
            .subscribe((data: any) => {
              this.notificationList = data["data"]["notifications"];
              this.notificationNumber = data["data"]["count"];
              if (this.notificationNumber > this.notificationNumber) {
                this.isShowNoti = true;
              } else if (this.notificationNumber === this.notificationNumber) {
                this.isShowNoti = false;
              }
            });
          this.toastServ.success("Notification Read", "", {
            timeOut: 1000,
          });
        } else {
          this.toastServ.error("Error Read", "", {
            timeOut: 1000,
          });
        }
      },
      (error) => {
        this.toastServ.error("Error Read", error, {
          timeOut: 1000,
        });
      }
    );
  }

  applyFilter(filterValue: string) {}

  openVideoNotifications() {
    this.router.navigate(["dashboard/video-notification"]);
  }

  getVideoCallNotification() {
    let dataToSend = {
      hospital_user_id: this.userData._id,
    };
    this.commonServ.getVideoCallNotification(dataToSend).subscribe((result) => {
      console.log("Notification", result);
      this.videoCallNotifications = result["data"]["data"];
      this.videoCallNotificationLength = result["data"]["count"];
    });
  }

  showLogout() {
    this.isShow = !this.isShow;
    if (this.isShow === true) {
      document.getElementById("dropDown").style.display = "block";
    } else if (this.isShow === false) {
      document.getElementById("dropDown").style.display = "none";
    }
  }

  logout() {
    this.localServ.clearToken();
    this.authServ.logout();
  }

  openMessages() {
    this.router.navigate(["/dashboard/chat"]);

    return;
  }

  openSettings() {}

  openSecurityQuestions() {}

  openProfile() {
    return;
  }

  showNotification() {
    this.isShowNoti = !this.isShowNoti;
    if (this.isShowNoti === true) {
      document.getElementById("noti").style.display = "block";
    } else if (this.isShowNoti === false) {
      document.getElementById("noti").style.display = "none";
    }
  }

  // quickLinkSelected(linkName: string) {
  //   // this.toastr.error("Page is in progress!");
  //   this.toggleSearch();
  //   // At present all links are being redirected to dashboard only $$..
  //   switch (linkName) {
  //     case "View Test Result": {
  //       this.router.navigateByUrl(routerLinks.patientDashboard);
  //       break;
  //     }
  //     case "Schedule Appointment": {
  //       this.router.navigateByUrl(routerLinks.scheduler);
  //       break;
  //     }
  //     case "Send Message": {
  //       this.router.navigateByUrl(routerLinks.sendMessage);
  //       break;
  //     }
  //     case "Pay Bill": {
  //       this.router.navigateByUrl(routerLinks.billingAccountSummary);
  //       break;
  //     }
  //     case "Health Summary": {
  //       this.router.navigateByUrl(routerLinks.healthSummary);
  //       break;
  //     }
  //     default: {
  //       this.router.navigateByUrl(routerLinks.patientDashboard);
  //       break;
  //     }
  //   }
  // }
}
