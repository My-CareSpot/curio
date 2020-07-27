import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignpatientdialogComponent } from './assignpatientdialog.component';

describe('AssignpatientdialogComponent', () => {
  let component: AssignpatientdialogComponent;
  let fixture: ComponentFixture<AssignpatientdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignpatientdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignpatientdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
