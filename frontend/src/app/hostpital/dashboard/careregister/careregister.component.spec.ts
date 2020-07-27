import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareregisterComponent } from './careregister.component';

describe('CareregisterComponent', () => {
  let component: CareregisterComponent;
  let fixture: ComponentFixture<CareregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
