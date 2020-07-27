import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonService } from "src/app/common.service";
import { ToastrService } from "ngx-toastr";
import { countries } from "../../country";
import { Router } from "@angular/router";
@Component({
  selector: "app-registerform",
  templateUrl: "./registerform.component.html",
  styleUrls: ["./registerform.component.scss"],
})
export class RegisterformComponent implements OnInit {
  registerForm: FormGroup;
  countries: any;
  passwordPattern: any =
    "^(?=.*[A-Za-z])(?=.*d)(?=.*[$@$!%*#?&])[A-Za-zd$@$!%*#?&]{8,}$";
  genderList = [
    { value: "male", name: "Male" },
    { value: "female", name: "Female" },
  ];
  addressType = [
    { value: "home", name: "Home" },
    { value: "office", name: "Office" },
  ];
  constructor(
    private fb: FormBuilder,
    private commonServ: CommonService,
    private toastserv: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.countries = countries;
    this.registerForm = this.fb.group({
      firstName: ["", Validators.required],
      middleName: ["", Validators.required],
      lastName: ["", Validators.required],
      gender: ["", Validators.required],
      profession: ["", Validators.required],
      phoneNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
      ],
      phoneCountry: ["", Validators.required],
      address_id: ["", Validators.required],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(this.passwordPattern),
        ]),
      ],
    });
  }
  get firstName() {
    return this.registerForm.get("firstName");
  }
  get middleName() {
    return this.registerForm.get("middleName");
  }
  get lastName() {
    return this.registerForm.get("lastName");
  }
  get gender() {
    return this.registerForm.get("gender");
  }

  get profession() {
    return this.registerForm.get("profession");
  }
  get phoneNumber() {
    return this.registerForm.get("phoneNumber");
  }
  get phoneCountry() {
    return this.registerForm.get("phoneCountry");
  }
  get email() {
    return this.registerForm.get("email");
  }
  get password() {
    return this.registerForm.get("password");
  }
  get address_id() {
    return this.registerForm.get("address_id");
  }

  registerUser() {
    this.commonServ.register(this.registerForm.value).subscribe(
      (data: any) => {
        if (data.code === 200) {
          this.toastserv.success(data.message, "", {
            timeOut: 1000,
          });
          this.router.navigate(["/login"]);
        } else if (data.code === 400) {
          this.toastserv.error(data.message, "", {
            timeOut: 1000,
          });
        }
      },
      (error) => {
        this.toastserv.error(error.error, "", {
          timeOut: 1000,
        });
      }
    );
  }
}
