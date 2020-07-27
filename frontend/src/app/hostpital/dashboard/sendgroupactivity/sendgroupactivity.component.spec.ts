import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendgroupactivityComponent } from './sendgroupactivity.component';

describe('SendgroupactivityComponent', () => {
  let component: SendgroupactivityComponent;
  let fixture: ComponentFixture<SendgroupactivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendgroupactivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendgroupactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
