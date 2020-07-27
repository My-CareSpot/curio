import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "admin",
    loadChildren: () => import("./superadmin/superadmin.module").then(m => m.SuperadminModule)
  },
  {
    path: "login",
    loadChildren: () => import("./login/login.module").then(m => m.LoginModule)
  },
  {
    path: "register",
    loadChildren: () =>
      import("./register/register.module").then(m => m.RegisterModule)
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./hostpital/hostpital.module").then(m => m.HostpitalModule)
  },
  {
    path: "forgot-password",
    loadChildren: () =>
      import("./fogotpassword/fogotpassword.module").then(
        m => m.FogotpasswordModule
      )
  },
  {
    path: "change-password",
    loadChildren: () =>
      import("./changepassword/changepassword.module").then(
        m => m.ChangepasswordModule
      )
  },
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "**",
    loadChildren: () =>
      import("./notfound/notfound.module").then(m => m.NotfoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
