import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {

  baseURL = environment.apiURL;
  constructor(private http: HttpClient) {}

  superadminlogin(data) {
    return this.http.post(this.baseURL + "/superadminlogin", data);
  }
  registersuperadmin(data) {
    return this.http.post(this.baseURL + "/registersuperadmin",data)
  }

  getHospitalList(data){
    return this.http.post(this.baseURL + "/gethospitallist",data)
  }
  deletehospital(data){
    return this.http.post(this.baseURL + "/deletehospitallist",data)
  }
  changePassword(data){
    return this.http.post(this.baseURL + "/change-password",data)
  }
}
