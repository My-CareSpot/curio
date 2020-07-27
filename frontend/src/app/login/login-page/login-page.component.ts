import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/auth.service";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { LocalService } from "src/app/local.service";
import { StorageService } from "src/app/storage.service";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  userData: any;
  emailID: any;
  userID: any;

  constructor(
    private toastServ: ToastrService,
    private commonServ: CommonService,
    private authServ: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private localService: LocalService,
    private storageServ: StorageService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: [
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
    this.commonServ.login(data).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastServ.success(data.message, "", {
            timeOut: 1000,
          });

          this.userData = JSON.stringify(data.data.user);
          sessionStorage.setItem("isReload", JSON.stringify(true));

          this.authServ.sendToken(data.data.token);
          this.localService.setJsonValue("user", this.userData);
          this.router.navigate(["/dashboard"]);
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
  get password() {
    return this.loginForm.get("password");
  }
  get email() {
    return this.loginForm.get("email");
  }
  goToSignUp() {
    this.router.navigate(["/register"]);
  }

  // sendLink() {
  //   let dataToPass = {
  //     email: this.emailID,
  //     user_id: this.userID
  //   };
  //   this.commonServ.sendRegisterlink(dataToPass).subscribe((data: any) => {
  //     let emailll = this.storageServ.decryptData(data.data.email);
  //   });
  // }
}
