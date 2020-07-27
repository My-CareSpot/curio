import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendmotivationComponent } from './sendmotivation.component';

describe('SendmotivationComponent', () => {
  let component: SendmotivationComponent;
  let fixture: ComponentFixture<SendmotivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendmotivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendmotivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
