import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperadminloginComponent } from './superadminlogin/superadminlogin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from "../auth.guard";
import { SuperAdminAuthGuard } from "./superauth.gaurd"
import { BusinessComponent } from './business/business.component';
import { AddhospitalComponent } from './addhospital/addhospital.component';
import { SubadminComponent } from './subadmin/subadmin.component';
import { AddsubadminComponent } from './addsubadmin/addsubadmin.component';


const routes: Routes = [
  { path: "", component: SuperadminloginComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "admin-business", pathMatch: "full" },
      { path: "admin-business", component: BusinessComponent },
      { path: "add-hospital", component: AddhospitalComponent },
      { path: "sub-admin", canActivate: [SuperAdminAuthGuard], component: SubadminComponent },
      { path: "add-sub-admin", canActivate: [SuperAdminAuthGuard], component: AddsubadminComponent },


      
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule { }
