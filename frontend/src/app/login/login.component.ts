import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "../common.service";
import { AuthService } from "../auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
