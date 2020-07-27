import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class AllserviceService {
  private userId = new BehaviorSubject<string>("");
  constructor() { }
  setUserId(data: string) {
    // Fire the update event with the new data
    this.userId.next(data);
  }

  getUserId(): Observable<string> {
    return this.userId.asObservable();
  }
}
