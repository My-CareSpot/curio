import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideocallnotificationComponent } from './videocallnotification.component';

describe('VideocallnotificationComponent', () => {
  let component: VideocallnotificationComponent;
  let fixture: ComponentFixture<VideocallnotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideocallnotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideocallnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
