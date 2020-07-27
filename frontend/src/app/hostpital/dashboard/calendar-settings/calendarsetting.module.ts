import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CalendarsettingRoutingModule } from "./calendarsetting-routing.module";
import { CalendarsettingComponent } from "./calendarsetting.component";
import {
  CalendarComponent,
  UnavailabilityDialog
} from "./calendar/calendar.component";
import { SetAvailabilityComponent } from "./set-availability/set-availability.component";
import { FullCalendarModule } from "@fullcalendar/angular";
import { MaterialModule } from "../../../material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";

@NgModule({
  declarations: [
    CalendarsettingComponent, 
    //UnavailabilityDialog
  ],
  imports: [
    CommonModule,
    CalendarsettingRoutingModule,
    FullCalendarModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  //entryComponents: [UnavailabilityDialog]
})
export class CalendarsettingModule {}
