import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCaretakerComponent } from './assigned-caretaker.component';

describe('AssignedCaretakerComponent', () => {
  let component: AssignedCaretakerComponent;
  let fixture: ComponentFixture<AssignedCaretakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedCaretakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedCaretakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
