import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import { LoginRoutingModule } from "./login-routing.module";
import { LoginPageComponent } from "./login-page/login-page.component";


@NgModule({
  declarations: [LoginPageComponent],
  imports: [CommonModule, LoginRoutingModule, FormsModule, ReactiveFormsModule,MatCardModule,MatCheckboxModule,MatButtonModule]
})
export class LoginModule {}
