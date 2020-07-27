import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { HttpClient } from '@angular/common/http';
//import { ApiUrlConstant } from '../../../../core/constant/api-url.constant';

@Injectable({
  providedIn: 'root'
})
export class CalendarsettingService {

  constructor(private http: HttpClient) { }

  // listSpecialistLocations(data: any): Rx.Observable<any> {
  //   return this.http.post(ApiUrlConstant.LISTSPECIALISTLOCATIONS, data);
  // }

  // addSpecialistAvailability(data: any): Rx.Observable<any> {
  //   return this.http.post(ApiUrlConstant.ADDSPECIALISTAVAILABILITY, data);
  // }

  // getSpecialistAvailability(data: any): Rx.Observable<any> {
  //   return this.http.post(ApiUrlConstant.GETSPECIALISTAVAILABILITY, data);
  // }

  // getSpecialistAppointment(data: any): Rx.Observable<any> {
  //   return this.http.post(ApiUrlConstant.GETSPECIALISTAPPOINTMENT, data);
  // }

  // bookAppointment(data: any): Rx.Observable<any> {
  //   return this.http.post(ApiUrlConstant.BOOKAPPOINTMENT, data)
  // }

}
