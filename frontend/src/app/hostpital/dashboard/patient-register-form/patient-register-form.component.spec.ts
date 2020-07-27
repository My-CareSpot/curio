import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRegisterFormComponent } from './patient-register-form.component';

describe('PatientRegisterFormComponent', () => {
  let component: PatientRegisterFormComponent;
  let fixture: ComponentFixture<PatientRegisterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientRegisterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
