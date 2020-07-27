import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpatientdialogComponent } from './editpatientdialog.component';

describe('EditpatientdialogComponent', () => {
  let component: EditpatientdialogComponent;
  let fixture: ComponentFixture<EditpatientdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditpatientdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditpatientdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
