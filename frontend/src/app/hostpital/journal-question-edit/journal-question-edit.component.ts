import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonService } from "src/app/common.service";
import { LocalService } from 'src/app/local.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-journal-question-edit',
  templateUrl: './journal-question-edit.component.html',
  styleUrls: ['./journal-question-edit.component.scss']
})
export class JournalQuestionEditComponent implements OnInit {
  existingFormData: any;
  OptionFormGroup: FormGroup;
  userData: any;
  action;
  questionId;
  questionData: any = "";

  surveyTypes: any[] = [
    { value: 'checkbox', viewValue: 'checkbox' }
  ];
  userId;
  Optionavailable: boolean;
  journalType: any;
  @ViewChild('myInputImage', {static: false}) private myInputVariable: ElementRef;
  convertedUrl: any;
  uploadUrl: string;
  oldImage: void;

  constructor(
    private _UserService: CommonService,
    private _FormBuilder: FormBuilder,
    private localServ: LocalService,
    private toastserv: ToastrService,
    private router: Router,


  ) {

  }

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.userId = this.userData._id;
    this.journalType = JSON.parse(this.localServ.getJsonValue("journalType"));
    this.OptionFormGroup = this._FormBuilder.group({
      question_id: '',
      userId: '',
      journalType: new FormControl({ value: null, disabled: true }, [Validators.required]),
      question: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.minLength(6)]),
      optionValue: this._FormBuilder.array([]),
      textPoint:new FormControl({ value: 0 }),
    });
    this.setFormalue()

  }

  setFormalue() {
    this.questionData = JSON.parse(this.localServ.getJsonValue("question"));
    this.oldImage = this.questionData.convertedUrl||null;
    this.OptionFormGroup.get("question_id").setValue(this.questionData._id);
    this.OptionFormGroup.get("userId").setValue(this.userData._id);
    this.OptionFormGroup.get("journalType").patchValue(this.questionData.journalType);
    this.OptionFormGroup.get("question").patchValue(this.questionData.question);
    if (this.questionData.journalType == "radio" || this.questionData.journalType == "checkbox") {
      this.Optionavailable = true;
    } else {
      this.Optionavailable = false;
    }
    if(this.questionData.journalType == "text" && this.questionData.typeOfjournal == "Screening"){
      this.OptionFormGroup.get("textPoint").patchValue(this.questionData.options[0].optionPoint);
    }
    this.loadMultipleOption(this.questionData.options);
  }

  get MultipleOption() {
    return this.OptionFormGroup.get("optionValue") as FormArray
  }

  loadMultipleOption(data) {
    for (let i = 0; i < data.length; i++) {
      this.addOption("oldOption");
      this.OptionFormGroup.get("optionValue").patchValue(data);
    }
  }

  addOption(input) {
    if (input == "oldOption" && this.journalType=='Screening') {
      const option = this._FormBuilder.group({
        optionValue: [""],
        _id: '',
        optionPoint:[0]
      });
      this.MultipleOption.push(option);

    }
    else if (input == "oldOption"  && this.journalType !='Screening') {
      const option = this._FormBuilder.group({
        optionValue: [0],
        _id: ''
      });
      this.MultipleOption.push(option);

    }
    else if (input != "oldOption" && this.journalType=='Screening') {
      const option = this._FormBuilder.group({
        optionValue: [""],
        optionPoint:[0]
      });
      this.MultipleOption.push(option);

    }
    else {
      const option = this._FormBuilder.group({
        optionValue: [""],

      });
      this.MultipleOption.push(option);

    }
  }

  addItem() {
    this.addOption("newOption");
  }

  removeOptions(i) {
    this.MultipleOption.removeAt(i);

  }
  uploadImage(event) {
    const file = (event.target as HTMLInputElement).files[0];
    let allowedType = ["image/jpeg", "image/jpg"]
    if (allowedType.indexOf(file.type) != -1) {
      let uploadData = new FormData();
      uploadData.append("file", file);
      this._UserService.uploadImg(uploadData).subscribe((res: any) => {
        if (res.code == 200) {
          this.convertedUrl = res.data.url;
          this.uploadUrl = file.name
        }
      })
    }
    else {
      this.toastserv.error("Only Jpeg/Jpg file format is allowed")
    }
  }
  updateSurveyForm() {
    let formValue = this.OptionFormGroup.value;
    // if(formValue.textPoint != ""){
      formValue.perform = "update";
      formValue.oldImage = this.oldImage;
      if(this.uploadUrl != null){
        formValue.convertedUrl=this.convertedUrl
        formValue.imgName=this.uploadUrl
      }
      
    if(this.questionData.journalType == "text" && this.questionData.typeOfjournal == "Screening"){
      formValue.optionValue[0].optionPoint = formValue.textPoint
    }

    let AllQuestionForm = {
      questions: [formValue]
    }
    this._UserService.SaveJournalQuestion({ AllQuestionForm }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.toastserv.success(res.message);
          this.router.navigate(['/dashboard/get-journalQuestionInfo'])

        }
        else{
          this.toastserv.error(res.message)
        }
      },
      (err) => {
        console.log('updateMySurvey', err)
      }
    )
      
    }
    
  // }


}
