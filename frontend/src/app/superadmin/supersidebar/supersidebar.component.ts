import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, timer, Observable } from "rxjs";
import { switchMap, windowTime } from "rxjs/operators";

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CommonService } from "src/app/common.service";
import { LocalService } from "src/app/local.service";

@Component({
  selector: 'app-supersidebar',
  templateUrl: './supersidebar.component.html',
  styleUrls: ['./supersidebar.component.scss'],
  animations: [
    trigger("indicatorRotate", [
      state("collapsed", style({ transform: "rotate(0deg)" })),
      state("expanded", style({ transform: "rotate(180deg)" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4,0.0,0.2,1)")
      ),
    ]),
  ],
})
export class SupersidebarComponent implements OnInit {

  userRoleId = 0;
  isMissCallNotification: boolean = true;
  isVideoCallNotification: boolean;
  videoCalLength: any = 0;
  missCallData: any;
  subscription: Subscription;
  hospita_user_id: any = "hospital_user_id";
  videoCallData: any;
  dashboardPageName = "";
  userData: any;
  user_id: any;
  missCallLength: any = 0;
  isSuperAdmin:boolean;
  @HostListener("window:resize", ["$event"])
  sizeChange(event) {
    this.sidebarMobile();
  }

  constructor(
    private router: Router,
    private commonServ: CommonService,
    private localServ: LocalService
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.isSuperAdmin = this.localServ.getJsonValue("isSuperAdmin");


    let dataToSend = {
      hospital_user_id: this.userData._id,
    };

    let dataToPass = {
      fromWhom: "hospital_user_id",
      from: this.user_id,
    };

    this.sidebarMobile();
    const dynamicScripts = "../../../../assets/js/slimscrol.js";
    const node = document.createElement("script");
    node.src = dynamicScripts;
    node.type = "text/javascript";
    node.async = false;
    node.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node);
  }

  sidebarMobile() {
    const windowWidth = window.innerWidth;
    if (windowWidth < 768) {
      document
        .getElementsByTagName("body")[0]
        .classList.add("collapsedSidebar");
    } else {
      document
        .getElementsByTagName("body")[0]
        .classList.remove("collapsedSidebar");
    }
  }

  // toggleMenus(e) {
  //   e.target
  //     .closest(".left-menu-link")
  //     .nextSibling.classList.toggle("expanded");
  //   e.target.closest(".left-menu-link").classList.toggle("active");
  // } 
}

