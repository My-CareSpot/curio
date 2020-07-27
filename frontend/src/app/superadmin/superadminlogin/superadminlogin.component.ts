import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/auth.service";
import { SuperadminService } from "../superadmin.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { StorageService } from "src/app/storage.service";

@Component({
  selector: 'app-superadminlogin',
  templateUrl: './superadminlogin.component.html',
  styleUrls: ['./superadminlogin.component.scss']
})
export class SuperadminloginComponent implements OnInit {

  SuperadminloginForm: FormGroup;
  userData: any;
  emailID: any;
  userID: any;

  constructor(
    private toastServ: ToastrService,
    private superadminserice: SuperadminService,
    private authServ: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private localService: LocalService,
  ) {}

  ngOnInit() {
    localStorage.clear();
    this.SuperadminloginForm = this.fb.group({
      superadminemail: ["", Validators.compose([Validators.required, Validators.email])],
      superadminpassword: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]),
      ],
    });
  }
  loginUser(data) {
    this.superadminserice.superadminlogin(data).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "", {
            timeOut: 1000,
          });
          localStorage.clear();

          this.userData = JSON.stringify(data.data.user);
          sessionStorage.setItem("isReload", JSON.stringify(true));
          this.authServ.sendToken(data.data.token);
          this.localService.setJsonValue("isSuperAdmin",data.data.isSuperAdmin);
          this.localService.setJsonValue("user", this.userData);
          this.localService.setJsonValue("userType",data.data.user.userType);
          this.router.navigate(["/admin/dashboard"]);
        } else if (data.code === 400) {
          this.toastServ.error(data.message, "", {
            timeOut: 1000,
          });
        }
      },
      (error) => {
        this.toastServ.error(error.error, "", {
          timeOut: 1000,
        });
      }
    );
  }
  get superadminpassword() {
    return this.SuperadminloginForm.get("superadminpassword");
  }
  get superadminemail() {
    return this.SuperadminloginForm.get("superadminemail");
  }
  // goToSignUp() {
  //   this.router.navigate(["/register"]);
  // }

}
