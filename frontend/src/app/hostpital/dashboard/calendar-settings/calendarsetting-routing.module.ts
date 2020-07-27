import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarsettingComponent, CalendarComponent, SetAvailabilityComponent } from '.';

const routes: Routes = [
  {   path: '', component: CalendarsettingComponent,
      children :[
          { path: '', redirectTo: 'calendar', pathMatch: 'prefix' },
          { path: 'calendar', component: CalendarComponent},
          { path: 'set-availability', component: SetAvailabilityComponent}
      ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarsettingRoutingModule { }
