import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointementrequestComponent } from './appointementrequest.component';

describe('AppointementrequestComponent', () => {
  let component: AppointementrequestComponent;
  let fixture: ComponentFixture<AppointementrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointementrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointementrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
