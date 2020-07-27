import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { countries } from '../../country';
import { SuperadminService } from '../superadmin.service';
import { LocalService } from 'src/app/local.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addsubadmin',
  templateUrl: './addsubadmin.component.html',
  styleUrls: ['./addsubadmin.component.scss']
})
export class AddsubadminComponent implements OnInit {

  basicDetailForm: FormGroup;
  passwordPattern: any = /^[A-Za-z0-9_@./#&+-]*$/
  countriesList: any = countries;
  protected userData;
  protected userType;


  constructor(
    private fb: FormBuilder,
    private superservice: SuperadminService,
    private localServ: LocalService,
    private router: Router,
    private toastserv: ToastrService,
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.userType = this.localServ.getJsonValue("userType");

    if (this.userType == null || this.userType == undefined) {
      this.router.navigate(['/login'])
    }

    this.basicDetailForm = this.fb.group({
      firstName: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      countryCode: ["1"],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(this.passwordPattern),
        ]),
      ],
    });
  }


  get password() {
    return this.basicDetailForm.get("password");
  }

  submitForm() {
    this.basicDetailForm;
    let objectData: any = this.basicDetailForm.value;
    objectData.hospitalId = this.userData._id;
    objectData.userType = "subadmin";
    this.superservice.registersuperadmin(objectData).subscribe((response: any) => {
      if (response.code == 200) {
        this.toastserv.success(response.message, "", {
          timeOut: 1000,
        });
        this.router.navigate(['admin/dashboard/admin-business']);

      }
      else {
        this.toastserv.error(response.message, "", {
          timeOut: 1000,
        });
      }

    })

  }

}

