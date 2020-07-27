import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ObserveableService {
  dataSource = new BehaviorSubject<any>(null);
  data = this.dataSource.asObservable()

  dataSource1 = new BehaviorSubject<any>(null);
  dataJournal = this.dataSource1.asObservable()

  constructor(private http: HttpClient) {}

  changeMessage1(message: string) {
    this.dataSource1.next(message)
  }
  
  
  changeMessage(message: string) {
    this.dataSource.next(message)
  }
}
