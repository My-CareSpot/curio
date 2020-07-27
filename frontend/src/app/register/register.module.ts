import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import { RegisterRoutingModule } from "./register-routing.module";
import { RegisterformComponent } from "./registerform/registerform.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

@NgModule({
  declarations: [RegisterformComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    ReactiveFormsModule,
    FormsModule,MatCardModule,MatCheckboxModule,MatButtonModule
  ]
})
export class RegisterModule {}
