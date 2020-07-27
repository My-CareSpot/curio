import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDialogueComponent } from './request-dialogue.component';

describe('RequestDialogueComponent', () => {
  let component: RequestDialogueComponent;
  let fixture: ComponentFixture<RequestDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
