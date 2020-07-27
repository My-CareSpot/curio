import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDosageDialogComponent } from './add-dosage-dialog.component';

describe('AddDosageDialogComponent', () => {
  let component: AddDosageDialogComponent;
  let fixture: ComponentFixture<AddDosageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDosageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDosageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
