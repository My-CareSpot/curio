import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonService } from "src/app/common.service";
import { LocalService } from 'src/app/local.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss']
})
export class QuestionEditComponent implements OnInit {
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
  assessmentType: any;

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
    this.assessmentType = JSON.parse(this.localServ.getJsonValue("assessmentType"));
    this.OptionFormGroup = this._FormBuilder.group({
      question_id: '',
      userId: '',
      assessmentType: new FormControl({ value: null, disabled: true }, [Validators.required]),
      question: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.minLength(6)]),
      optionValue: this._FormBuilder.array([]),
      textPoint:new FormControl({ value: 0 }),
    });
    this.setFormalue()

  }

  setFormalue() {
    this.questionData = JSON.parse(this.localServ.getJsonValue("question"));
    this.OptionFormGroup.get("question_id").setValue(this.questionData._id);
    this.OptionFormGroup.get("userId").setValue(this.userData._id);
    this.OptionFormGroup.get("assessmentType").patchValue(this.questionData.assessmentType);
    this.OptionFormGroup.get("question").patchValue(this.questionData.question);
    if (this.questionData.assessmentType == "radio" || this.questionData.assessmentType == "checkbox") {
      this.Optionavailable = true;
    } else {
      this.Optionavailable = false;
    }
    if(this.questionData.assessmentType == "text" && this.questionData.typeOfAssessment == "Screening"){
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
    if (input == "oldOption" && this.assessmentType=='Screening') {
      const option = this._FormBuilder.group({
        optionValue: [""],
        _id: '',
        optionPoint:[0]
      });
      this.MultipleOption.push(option);

    }
    else if (input == "oldOption"  && this.assessmentType !='Screening') {
      const option = this._FormBuilder.group({
        optionValue: [0],
        _id: ''
      });
      this.MultipleOption.push(option);

    }
    else if (input != "oldOption" && this.assessmentType=='Screening') {
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
  updateSurveyForm() {
    let formValue = this.OptionFormGroup.value;
    // if(formValue.textPoint != ""){
      formValue.perform = "update";
    if(this.questionData.assessmentType == "text" && this.questionData.typeOfAssessment == "Screening"){
      formValue.optionValue[0].optionPoint = formValue.textPoint
    }

    let AllQuestionForm = {
      questions: [formValue]
    }
    this._UserService.SaveMySurvey({ AllQuestionForm }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.toastserv.success(res.message);
          this.router.navigate(['/dashboard/get-userQuestionInfo'])

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
