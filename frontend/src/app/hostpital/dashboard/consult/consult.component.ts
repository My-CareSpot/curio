import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
} from "@angular/core";
import { AddRecordDialogComponent } from "../../add-record-dialog/add-record-dialog.component";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator,
} from "@angular/material";
import { Observable, of } from "rxjs";
import { CommonService } from "src/app/common.service";
import { LocalService } from "src/app/local.service";
import { FormBuilder } from "@angular/forms";
import { VidyoParticipant } from "./VidyoParticipant";

//function onVidyoClientLoaded() {}
//import vidyoConnector from "../../../../videoload.js";
declare var vidyoConnector: any;
function onVidyoClientLoaded() {}

@Component({
  selector: "app-consult",
  templateUrl: "./consult.component.html",
  styleUrls: ["./consult.component.scss"],
})
export class ConsultComponent implements OnInit, AfterViewInit, OnDestroy {
  appointmentDetails: any;
  userName: any;
  userId: any;
  roomName: any;
  token: any;
  apId: any;
  userInfo: any;
  //connected: boolean;
  tempData: any;
  // join: boolean;
  private host = "prod.vidyo.io";

  panelOpenState = false;
  // Not supporting text chat in this version
  // private messages: VidyoChatMessage[];
  join = true;
  /* Participant list */
  public participants: VidyoParticipant[] = [];

  /* Preview button display toggle control */
  public preview = true;

  /* Mute button display toggle control */
  public muted: any = false;
  userData;
  /* Call Connect button display toggle control */
  public connected = false;

  constructor(
    public dialog: MatDialog,
    private commonServ: CommonService,
    private localServ: LocalService,
    private fb: FormBuilder,
    private zone: NgZone,
    private router: Router
  ) {}

  public loadScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement("script");
    script.innerHTML = "";
    script.src =
      "https://static.vidyo.io/latest/javascript/VidyoClient/VidyoClient.js?onload=onVidyoClientLoaded";
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  ngOnInit() {
    this.loadScript();
    // onVidyoClientLoaded();

    onVidyoClientLoaded();
    this.commonServ.getAppointmentData().subscribe((data: any) => {
      console.log("DAta", data);
      this.tempData = data;
    });
    this.appointmentDetails = this.tempData;

    localStorage.setItem("hexacode", JSON.stringify(this.appointmentDetails));

    this.appointmentDetails = JSON.parse(localStorage.getItem("hexacode"));
    console.log("appointmentDetails", this.appointmentDetails);
    this.apId = this.appointmentDetails.appointment_request_id;
    this.userName = this.appointmentDetails.caretaker_name;
    this.userId = this.appointmentDetails.caretaker_user_id;
    this.roomName = this.apId;
    this.userInfo = {
      userId: this.userId,
      userName: this.userName,
      appointmentId: this.apId,
    };

    this.startVideoCall(this.userInfo);

    setTimeout(() => {
      console.log("inseide");
      this.startVideoCall(this.userInfo);
    }, 5000);

    //console.log("VCCCCCC", onVidyoClientLoaded);
  }

  ngAfterViewInit() {
    onVidyoClientLoaded();

    setTimeout(() => {
      this.startVideoCall(this.userInfo);
    }, 5000);
  }

  openDialogforRecording() {
    const dialogRef = this.dialog.open(AddRecordDialogComponent, {
      width: "600px",
      data: {
        // type: type,
        // data: data
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // show success message $$..
      }
    });
  }
  startVideoCall(data) {
    console.log("StartVideoCall CALLED", data);
    //this.startcron("start");
    this.join = true;

    vidyoConnector
      .RegisterLocalCameraEventListener({
        onAdded: function (localCamera) {
          console.log("ADDD", localCamera);
        },
        onRemoved: function (localCamera) {
          console.log("onRem", localCamera);
        },
        onSelected: function (localCamera) {
          console.log("Sekec", localCamera);
          if (localCamera) {
            console.log("On", localCamera);
            const selectedCamera = localCamera;
          }
        },
        onStateUpdated: function (localCamera, state) {},
      })
      .then(function () {
        console.log("Regist erLocalCameraEventListener Success");
      })
      .catch(function () {
        console.error("RegisterLocalCameraEventListener Failed");
      });

    //Register microphone

    vidyoConnector
      .RegisterLocalMicrophoneEventListener({
        onAdded: function (localMicrophone) {},
        onRemoved: function (localMicrophone) {},
        onSelected: function (localMicrophone) {
          if (localMicrophone) {
            const selectedMicrophone = localMicrophone;
          }
        },
        onStateUpdated: function (localMicrophone, state) {},
      })
      .then(function () {
        console.log("RegisterLocalMicrophoneEventListener Success");
      })
      .catch(function () {
        console.error("RegisterLocalMicrophoneEventListener Failed");
      });

    //Register localspeaker

    vidyoConnector
      .RegisterLocalSpeakerEventListener({
        onAdded: function (localSpeaker) {},
        onRemoved: function (localSpeaker) {},
        onSelected: function (localSpeaker) {
          if (localSpeaker) {
            const selectedSpeaker = localSpeaker;
          }
        },
        onStateUpdated: function (localSpeaker, state) {},
      })
      .then(function () {
        console.log("RegisterLocalSpeakerEventListener Success");
      })
      .catch(function () {
        console.error("RegisterLocalSpeakerEventListener Failed");
      });

    // T ODO need to generate token every time, we should check the token expiry
    // const generateTokenValue = this .generateToken(this .key, this .appID, this .userName, this .expiresInSeconds, "");
    // const userInfo = {
    //   userId: this.userId,
    //   userName: this.userName,
    //   appointmentId: this.apId,
    // };
    this.commonServ.generateToken(data).subscribe(
      (res: any) => {
        console.log("res from backend", res);
        // return res.data;

        const generateTokenValue = res.data.token;
        console.log("generateTokenValueNow", generateTokenValue);
        this.token = generateTokenValue;
        if (this.userName !== "" && this.roomName !== "") {
          vidyoConnector
            .Connect({
              host: this.host,
              token: generateTokenValue,
              displayName: this.userName,
              resourceId: this.roomName,
              onSuccess: () => {
                this.join = false;
                console.log("Connected User");
                // alert('Connected');
                this.connected = true;
                this.addNewParticipant("1", `${this.userName} (You)`);
              },
              onFailure: (reason) => {
                this.connected = false;
                console.error("Connection Failed To connect nadim: ", reason);
              },
              onDisconnected: (reason) => {
                this.connected = false;
                this.removeAllParticipants();

                // alert('Connection Disconnected ');
                console.log("Connection Disconnected - " + reason);
              },
            })
            .then((status) => {
              console.log("STATUES", status);

              if (status) {
                this.connected = true;
                this.registerParticipantEventListener();

                this.registerMessageEventListener(); // UI not ready yet.
              }
            })
            .catch((err) => {
              console.log("Connect Error", err);
            });
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  /**
   * TODO: fix list refresh on UI.
   * Adds a new participant to the list.
   * Trying Observable to update the participants list reference, no luck, have to use zone.
   * @param participantId participant id
   * @param participantName participant name
   */
  private addNewParticipant(participantId: string, participantName: string) {
    this.zone.run(
      () =>
        (this.participants = [
          new VidyoParticipant(participantId, participantName),
          ...this.participants,
        ])
    );
    // of(new VidyoParticipant(participantId, participantName)).subscribe((data) => this .participants = [data, ...this .participants]);
  }

  /**
   * TODO: fix list refresh on UI.
   * Remove participant from the list
   * Trying Observable to update the participants list reference, no luck, have to use zone.
   * @param deletedParticipantId id of the deleted participant
   */
  private removeParticipant(deletedParticipantId: string) {
    this.zone.run(
      () =>
        (this.participants = this.participants.filter(
          (vidyoParticipant) =>
            vidyoParticipant.participantId !== deletedParticipantId
        ))
    );

    // of(deletedParticipantId).subscribe(
    //   (pId) => this .participants = this .participants.filter(vidyoParticipant => vidyoParticipant.participantId !== deletedParticipantId)
    // );
  }

  /**
   * Register for Participant add/join events.
   */
  private registerParticipantEventListener() {
    console.log("Registering for Participants events");
    let that = this; // can use .bind() as well.

    vidyoConnector
      .RegisterParticipantEventListener({
        onJoined: (participant) => {
          // alert('joined particepent' + participant);
          // this.stopnotitification();
          console.log("Joined", participant);
          that.addNewParticipant(participant.id, participant.name);
        },
        onLeft: (participant) => {
          console.log("Left", participant);
          that.removeParticipant(participant.id);
        },
        onDynamicChanged: (participants, cameras) => {},
        onLoudestChanged: (participant, audioOnly) => {},
      })
      .then(() => {
        this.join = false;
        console.log("Registered with Participant Events Listener");
      })
      .catch((e) => {
        console.log(
          `Error while registering with Participant Events Listener ${e}`
        );
      });
  }

  /**
   * TODO: Not being utilized as of now, since UI isn't ready.
   * Register for message events.
   */
  private registerMessageEventListener() {
    console.log("Registering for Chat Messages events");
    vidyoConnector
      .RegisterMessageEventListener({
        onChatMessageReceived: (participant, chatMessage) => {
          console.log(
            `message received for participant ${participant.id}:${participant.name} - ${chatMessage.body}`
          );
          // this .messages.push(new VidyoChatMessage(participant.id, participant.name, chatMessage.body));
        },
      })
      .then(() => {
        console.log("Registered with Message Events Listener");
      })
      .catch(() => {
        console.log("Error while registering with Message Events Listener");
      });
  }

  /**
   * Toggles the preview button/functionality
   */
  togglePreview() {
    this.preview = !this.preview;
    console.log(`Toggle Preview to: ${this.preview}`);
    vidyoConnector.ShowPreview({ preview: this.preview });
  }

  /**
   * Toggles the mic button/functionality
   */
  toggleMic() {
    this.muted = !this.muted;
    console.log(`Toggle mic muted to: ${this.muted}`);
    vidyoConnector.SetMicrophonePrivacy({ privacy: this.muted });
  }

  /**
   * Toggles the video call button/functionality
   */
  toggleConnect() {
    if (this.connected) {
      //this.stopnotitification();
      // this.userServ.changeNabarStatus(false);
      console.log("Disconnecting video call");
      vidyoConnector.SelectLocalCamera({ localCamera: null });
      vidyoConnector.SelectLocalMicrophone({ localMicrophone: null });
      // this.notifyme("Do You want to end the call");
      vidyoConnector.Disconnect(); // need to check success, before removing participants.
      this.removeAllParticipants();
      this.connected = false;
      this.router.navigate(["dashboard/appointment-request"]);
    } else {
      // this.userServ.changeNabarStatus(true);
      console.log("call toggle");
      this.startVideoCall(this.userInfo);
    }
  }
  private removeAllParticipants() {
    console.log("Removing all participants");
    of([]).subscribe((data) => (this.participants = data));
  }

  ngOnDestroy() {
    // this.stopnotitification();
    // vidyoConnector.SelectLocalCamera({localCamera: null});
    // vidyoConnector.SelectLocalMicrophone({ localMicrophone: null });
    if (this.connected) {
      console.log("Disconnecting video call");
      vidyoConnector.SelectLocalCamera({ localCamera: null });
      vidyoConnector.SelectLocalMicrophone({ localMicrophone: null });

      vidyoConnector.Disconnect(); // need to check success, before removing participants.
      // this.removeAllParticipants();
      this.connected = false;
    } else {
      vidyoConnector.SelectLocalCamera({ localCamera: null });
      vidyoConnector.SelectLocalMicrophone({ localMicrophone: null });

      vidyoConnector.Disconnect(); // need to check success, before removing participants.
      // this.removeAllParticipants();
    }
  }
}
