import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegisterformComponent } from "./registerform/registerform.component";

const routes: Routes = [{ path: "", component: RegisterformComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule {}
