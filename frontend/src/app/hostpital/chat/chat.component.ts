import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { ChatService } from './chat.service';
import { LocalService } from 'src/app/local.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { environment } from "../../../environments/environment";
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialogConfig,
} from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { AESEncryptDecryptService } from 'src/app/AESEncryptDecryptService.service';
declare var require: any
const FileSaver = require('file-saver');



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  public userData: any;
  public user_id: any;
  public patientList: any;
  public mesgArray: any=[];
  public currentUser: String;
  public headName: Boolean = false;
  public roomId: any;
  public enterMessage: any;
  public newMessageObj: Object;
  public getNewUser: String = "";
  public getNewMessage: String = "";
  public getNewDate: Date;
  public getNewRoomId: String = "";
  public isSearch: String = "";
  public srcUrl = environment.socketUrl;
  public showModal = false;
  public imagepreview;
  public selectedImgName;

  @ViewChild('scrollMe', {static: false}) private myScrollContainer: ElementRef;
  @ViewChild('myInput', {static: false}) private myInputVariable: ElementRef;

  constructor(
    private _chatService: ChatService,
    private localServ: LocalService,
    private commonService: CommonService,
    private toastserv: ToastrService,
    private _AESEncryptDecryptService: AESEncryptDecryptService


  ) {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.user_id = this.userData._id;
    this.getPatient();
    this._chatService.newUserJoined().subscribe(data => {
    });
    this._chatService.userLeftRoom().subscribe(data => {
    })
    this._chatService.chatHistory().subscribe(data => {
      this.mesgArray = [];
      if(data && data.message){
        let encryptedData:any = data.message;
        encryptedData.forEach(x=>{
          this.mesgArray.push(JSON.parse(this._AESEncryptDecryptService.decrypt(x.data)))
        })
      }      
    })
    this._chatService.getRoomId().subscribe(data => {
      this.roomId = "";
      this.roomId = data;
    })
    this._chatService.getMessage().subscribe((result: any) => {
      this.enterMessage = ""; 
      let data = JSON.parse(this._AESEncryptDecryptService.decrypt(result));
     let Incomingdata = {createdAt:data.createdAt, _id: data._id, id: data._id,
       text:data.text, image:data.image, imageType:data.imageType,imageName:data.imageName};
     this.mesgArray.push(Incomingdata);
      
    })
    
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 

ngOnDestroy(): void{
  this.leave()
}
showImage(url,imgname){
  this.imagepreview = this.srcUrl + url
  this.selectedImgName = imgname;
  this.showModal = true;
}
hide(){
  this.showModal = false;

}

downloadPdf(pdfUrl: string, pdfName: string ) {
  let url = this.srcUrl + pdfUrl
  FileSaver.saveAs(url, pdfName);
}

scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}

  searchPatient(){
    this.getPatient();
  }

  sendMessage() {
    if (this.enterMessage) {
      let chatMessage = {
        _id: this.user_id,
        text: this.enterMessage,
        roomId: this.roomId,
        createdAt: new Date(),
        image:null,
        imageType:null,
        imageName:null,
        user:{
          _id:2,
          name:this.currentUser
      }

      }

      let sendMessage = {
        data:this._AESEncryptDecryptService.encrypt(JSON.stringify(chatMessage)),
        roomId: this.roomId
      }


      // let encryptedText = this._AESEncryptDecryptService.encrypt(JSON.stringify(chatMessage));
    
      this._chatService.sendMessage(sendMessage);
    }

  }

  getPatient() {
    let data:any = {
      user_id: this.user_id,
      userType:this.userData.userType
    };
   
    if(this.isSearch){
      data.isSearch = this.isSearch;      
      this.commonService.getSearchedPatientList(data).subscribe((response: any) => {
        if (response.code == 200) {
          this.patientList = response.data;
        }
      });
    }
    else{
      this.commonService.getPatientList(data).subscribe((response: any) => {
        if (response.code == 200) {
          this.patientList = response.data;
        }
      });

    }
    
  }

  uploadImage(event) {
    const file = (event.target as HTMLInputElement).files[0];
    const uploadData = new FormData();
    let userObj:any = {
      _id:2,
      name:this.currentUser
  }
    uploadData.append("file", file);
    uploadData.append("_id", this.user_id);
    uploadData.append("roomId",this.roomId);
    uploadData.append("user",JSON.stringify(userObj));

    let allowedType = ["image/jpeg","image/jpg","image/webp","application/pdf","text/plain",""]

    if(allowedType.indexOf(file.type) != -1){

      let imageType = ["image/jpeg","image/jpg","image/webp"];

    if(imageType.indexOf(file.type) != -1){
      uploadData.append("imageType","1");
    }
    else if(file.type=="application/pdf"){
      uploadData.append("imageType","2");
    }
    else {
      uploadData.append("imageType","3");
    }

    this.commonService.attachmentUpload(uploadData).subscribe((data: any) => {
      if(data.code == 200){

        let Incomingdata = {createdAt:data.data.createdAt, _id: data.data._id, id: data.data._id,
           image:data.data.image,imageType:data.data.imageType,imageName:data.data.imageName};
        let chatMessage = {
        _id: Incomingdata._id,
        image: Incomingdata.image,
        imageType:Incomingdata.imageType,
        roomId: this.roomId,
        imageName: Incomingdata.imageName,
        text:null,
        createdAt:new Date(),
        user:{
          _id:2,
          name:this.currentUser
      }

      }

      let sendMessage = {
        data:this._AESEncryptDecryptService.encrypt(JSON.stringify(chatMessage)),
        roomId: this.roomId
      }
      this._chatService.sendMessage(sendMessage);
        // this.mesgArray.push(Incomingdata);
        this.myInputVariable.nativeElement.value = "";

      }
      else{
        console.log("error")
      }
      // if (data.code === 200) {
      //   this.toastserv.success(data.message, "", {
      //     timeOut: 1000,
      //   });
      // } else if (data.code === 400) {
      //   this.toastserv.success(data.message, "", {
      //     timeOut: 1000,
      //   });
      // }
    });

    }
    else{
      this.toastserv.error("File selected is not allowed")
    }
    
    
  }

  join(element) {
    this.mesgArray=[];
    this.currentUser = element.firstName + ' ' + element.lastName;
    this.headName = true;
    let eachObj = {
      user1_name: this.userData.firstName,
      user1_id: this.user_id,
      user2_id: element.user_id,
      user2_name: element.firstName
    }
    this._chatService.joinRoom(eachObj);
  }

  leave() {
    this._chatService.leaveRoom({ user: this.user_id, room: this.roomId })
  }


}
