import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecordDialogComponent } from './add-record-dialog.component';

describe('AddRecordDialogComponent', () => {
  let component: AddRecordDialogComponent;
  let fixture: ComponentFixture<AddRecordDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecordDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
