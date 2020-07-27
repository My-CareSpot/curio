import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable, observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  socketUrl: any = environment.socketUrl;

  private socket = io(this.socketUrl);

  joinRoom(data) {
    this.socket.emit("join", data);
  }
  leaveRoom(data) {
    this.socket.off("new message")
  }
  sendMessage(data) {
    this.socket.emit("message", data);
  }

  getRoomId() {
    let observable = new Observable<{ user: String; message: String }>(
      (observer) => {
        this.socket.on("room Id", (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }

  chatHistory() {
    let observable = new Observable<{ user: String; message: String }>(
      (observer) => {
        this.socket.on("chat History", (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }

  newUserJoined() {
    let observable = new Observable<{ user: String; message: String }>(
      (observer) => {
        this.socket.on("new user joined", (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }

  userLeftRoom() {
    let observable = new Observable<{ user: String; message: String }>(
      (observer) => {
        this.socket.on("left room", (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }

  getMessage() {
    let observable = new Observable<{ user: String; message: String }>(
      (observer) => {
        this.socket.on("new message", (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }

  constructor() {}
}
