import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';

import { SuperadminRoutingModule } from './superadmin-routing.module';
import { SuperadminloginComponent } from './superadminlogin/superadminlogin.component';
import { SupersidebarComponent } from './supersidebar/supersidebar.component';
import { SuperheadbarComponent } from './superheadbar/superheadbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BusinessComponent } from './business/business.component';
import { MatFormFieldModule, MatSelectModule, MatStepperModule, MatInputModule, MatDialogModule, MatSlideToggleModule, MatProgressSpinnerModule } from "@angular/material";
import { AddhospitalComponent } from './addhospital/addhospital.component';
import { MaterialModule } from '../material.module';
import { FootersuperComponent } from './footersuper/footersuper.component';
import { SubadminComponent } from './subadmin/subadmin.component';
import { AddsubadminComponent } from './addsubadmin/addsubadmin.component';



@NgModule({
  declarations: [SuperadminloginComponent, SupersidebarComponent,
     SuperheadbarComponent, DashboardComponent, BusinessComponent, AddhospitalComponent, FootersuperComponent, SubadminComponent, AddsubadminComponent
    ],
  imports: [
    CommonModule,
    SuperadminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MaterialModule,
    MatStepperModule,
    MatInputModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ]
})
export class SuperadminModule { }
