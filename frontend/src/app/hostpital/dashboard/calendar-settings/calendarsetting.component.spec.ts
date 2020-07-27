import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarsettingComponent } from './calendarsetting.component';

describe('CalendarsettingComponent', () => {
  let component: CalendarsettingComponent;
  let fixture: ComponentFixture<CalendarsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
