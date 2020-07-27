import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { AuthService } from "src/app/auth.service";

import { Subscription, timer, Observable } from "rxjs";
import { switchMap, windowTime } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuperadminService } from '../superadmin.service';

@Component({
  selector: 'app-superheadbar',
  templateUrl: './superheadbar.component.html',
  styleUrls: ['./superheadbar.component.scss']
})
export class SuperheadbarComponent implements OnInit {
  userRoleId = 0;
  isShow: boolean;
  notificationList: any;
  notificationNumber: any = 0;
  subscription: Subscription;
  isChangePassword:boolean=false;
  passwordPattern:any= /^[A-Za-z0-9_@./#&+-]*$/;

  videoCallNotifications: any;
  videoCallNotificationLength: any = 0;

  isShowNoti: boolean = false;

  userData: any;

  title = "integrated-eHealth-Solutions";
  changePasswordForm: FormGroup;
  showPasswordError: boolean;
  isValidForm:boolean = true; 


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
    private fb:FormBuilder,
    private router: Router,
    private localServ: LocalService,
    private toastServ: ToastrService,
    private superadminservice : SuperadminService,
    private authServ: AuthService // private localStorageService: LocalStorageService, // private notifierService: NotificationService
  ) {
    // this.userRoleId = parseInt(this.localStorageService._getUserRoleId().toString());
  }

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));

    // const dynamicScripts = ["../../../../assets/js/sidebar.js"];
    // for (let i = 0; i < dynamicScripts.length; i++) {
    //   const node = document.createElement("script");
    //   node.src = dynamicScripts[i];
    //   node.type = "text/javascript";
    //   node.async = false;
    //   node.charset = "utf-8";
    //   document.getElementsByTagName("head")[0].appendChild(node);
    //   node.onload = function () {};
    // }
    this.changePasswordForm = this.fb.group({
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(this.passwordPattern),
        ]),
      ],
      confirmpassword: ["", Validators.required],
    });

    this.changePasswordForm
      .get("confirmpassword")
      .valueChanges.subscribe((data: any) => {
        if (this.changePasswordForm.get("password").value !== data) {
          this.showPasswordError = true;
          this.isValidForm = true;
        } else if (this.changePasswordForm.get("password").value === data) {
          this.showPasswordError = false;
          this.isValidForm = false;
        }
      });
  }

  changePassword(data){
    if(this.changePasswordForm.status!="INVALID"){
      let obj = {
        password: data.password,
        _id:this.userData._id
      }
      this.superadminservice.changePassword(obj).subscribe((data: any) => {
        if (data.code === 200) {
          this.toastServ.success("Password Updated Successfully", "", {
            timeOut: 1000,
          });
          this.isChangePassword = false;
          this.changePasswordForm.reset();
          this.router.navigate(["admin/dashboard/admin-business"])
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", {
            timeOut: 1000,
          });
        }
      });

    }
    

  }

  cancelDialog() {
    this.isChangePassword = false;
    this.changePasswordForm.reset();

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
    this.router.navigate(['admin']);
  }

  openSettings() {}

  openProfile() {
    return;
  }
  get password() {
    return this.changePasswordForm.get("password");
  }


}

