import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/common.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/local.service';
export interface assessmentType {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-question-add',
  templateUrl: './question-add.component.html',
  styleUrls: ['./question-add.component.scss']
})
export class QuestionAddComponent implements OnInit {

  selectedValue: string;
  selectedCar: string;
  user_id;
  AllQuestionForm: FormGroup
  SurveyForm: FormArray;
  options: FormArray;
  action;
  assessment_id;
  assessmentTypes: assessmentType[];
  userData;
  assessmentData;
  assessmentType;

  constructor(
    private _FormBuilder: FormBuilder,
    private _Router: Router,
    private _UserService: CommonService,
    private location: Location,
    private localServ: LocalService

  ) {

  }

  ngOnInit() {
    this.userData = JSON.parse(this.localServ.getJsonValue("user"));
    this.assessmentData = JSON.parse(this.localServ.getJsonValue("assessmentId"));
    this.assessmentType = JSON.parse(this.localServ.getJsonValue("assessmentType"));

    this.user_id = this.userData._id;


    this._UserService.surveyListItemObserver.subscribe(res => {
      this.action = 'question';
      this.assessment_id = this.assessmentData;
      this.assessmentTypes = [       
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
      assessment_id: this.assessment_id,
      assessmentType: new FormControl({ value: null, disabled: false },
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

  submitSurveyForm() {
    const fetchData = {
      AllQuestionForm: this.AllQuestionForm.value,
      action: this.action
    }
    fetchData.AllQuestionForm.questions[0].typeOfAssessment = this.assessmentType;

    this._UserService.SaveMySurvey(fetchData).subscribe(
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
    this._Router.navigateByUrl('/dashboard/get-userQuestionInfo')
  }

  ngOnDestroy() {
  }

}
