import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/common.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/local.service';
import { ToastrService } from 'ngx-toastr';
export interface journalType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-journal-question-add',
  templateUrl: './journal-question-add.component.html',
  styleUrls: ['./journal-question-add.component.scss']
})
export class JournalQuestionAddComponent implements OnInit {

  selectedValue: string;
  selectedCar: string;
  user_id;
  AllQuestionForm: FormGroup
  SurveyForm: FormArray;
  options: FormArray;
  action;
  journal_id;
  journalTypes: journalType[];
  userData;
  journalData;
  journalType;
  uploadUrl:any;
  convertedUrl:any;

  @ViewChild('myInputImage', {static: false}) private myInputVariable: ElementRef;

  constructor(
    private _FormBuilder: FormBuilder,
    private _Router: Router,
    private _UserService: CommonService,
    private location: Location,
    private localServ: LocalService,
    private toastserv: ToastrService,

  ) {

  }

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.journalData = JSON.parse(this.localServ.getJsonValue("journalId"));
    this.journalType = JSON.parse(this.localServ.getJsonValue("journalType"));

    this.user_id = this.userData._id;


    this._UserService.surveyListItemObserver.subscribe(res => {
      this.action = 'question';
      this.journal_id = this.journalData;
      this.journalTypes = [       
        { value: 'checkbox', viewValue: 'checkbox' },
        { value: 'radio', viewValue: 'radio' },
        { value: 'text', viewValue: 'text' }
      ];
    })
    this.AllQuestionForm = this._FormBuilder.group({
      questions: this._FormBuilder.array([this.createNewForm()])
    })
    this.addItem(0)
  }
  createOption(): FormGroup {
    return this._FormBuilder.group({
      optionValue: new FormControl({ value: 'option', disabled: false },
        [Validators.required]),
      optionPoint: new FormControl({ value: 0, disabled: false },
        [Validators.required]),
    });
  }

  createNewForm(): FormGroup {
    return this._FormBuilder.group({
      textPoint: new FormControl({ value: 0, disabled: false },
        [Validators.required]),
      user_id: this.user_id,
      journal_id: this.journal_id,
      journalType: new FormControl({ value: null, disabled: false },
        [Validators.required]),
      question: new FormControl({ value: null, disabled: false },
        [Validators.required, Validators.minLength(6)]),
      options: this._FormBuilder.array([])

    })
  }
  addItem(index): void {
    this.options = this.AllQuestionForm.get('questions')['controls'][index].get('options') as FormArray;
    this.options.push(this.createOption());
    this.options.push(this.createOption());
  }

  addQuestions(): void {
    this.options = this.AllQuestionForm.get('questions') as FormArray;
    this.options.push(this.createNewForm());
    this.addItem(this.options.controls.length - 1)
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

  submitSurveyForm() {
    const fetchData = {
      AllQuestionForm: this.AllQuestionForm.value,
      action: this.action,
      imgName:this.uploadUrl||null,
      convertedUrl:this.convertedUrl||null

    }
    fetchData.AllQuestionForm.questions[0].typeOfjournal = this.journalType;
    this._UserService.SaveJournalQuestion(fetchData).subscribe(
      (res) => {
        this.gobackAllSurvey()
      },
      (err) => {
      }
    )
  }

  removeOptions(qi, i) {
    const control = this.AllQuestionForm.get('questions')['controls'][qi].get('options')
    control.removeAt(i);
  }

  removeQuestion(i) {
    if (i > 0) {
      const control = this.AllQuestionForm.get('questions') as FormArray;
      control.removeAt(i);
    }

  }

  gobackAllSurvey() {
    this._Router.navigateByUrl('/dashboard/get-journalQuestionInfo')
  }

  ngOnDestroy() {
  }

}

