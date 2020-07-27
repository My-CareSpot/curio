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
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
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
export class SidebarComponent implements OnInit {
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

  toggleMenus(e) {
    e.target
      .closest(".left-menu-link")
      .nextSibling.classList.toggle("expanded");
    e.target.closest(".left-menu-link").classList.toggle("active");
  }

  sidebarMenuSelected(event, menuName: string) {
    switch (menuName) {
      case "Personal Health Portal": {
      }
      case "Summary": {
      }

      case "Document Center": {
      }
      case "Clinical Summary": {
      }
      case "documentCenter_Reports": {
      }
      case "documentCenter_SearchRecords": {
      }

      default: {
      }
    }

    var x = document.querySelectorAll("#slimScrollContainer li");
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("activeLink");
    }
    (<HTMLElement>event.target).closest("li").classList.add("activeLink");
    const liparent = (<HTMLElement>event.target).closest("li");
  }
  showTooltip(tooltipID, tooltipTxt) {
    if (
      document
        .getElementsByTagName("body")[0]
        .classList.contains("collapsedSidebar")
    ) {
      var viewportOffset = document
        .getElementById(tooltipID)
        .getBoundingClientRect();
      var top = viewportOffset.top;
      // var left = viewportOffset.left;
      // console.log(left);
      document.getElementById("tooltipContainer").style.top = top + "px";
      // document.getElementById('tooltipContainer').style.left = left+'px';
      document.getElementById("tooltipContainer").style.display = "block";
      document.getElementById("tooltipTxt").innerHTML = tooltipTxt;
    }
  }
  hideTooltip() {
    document.getElementById("tooltipContainer").style.display = "none";
  }
}
