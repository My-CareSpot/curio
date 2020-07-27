import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostpitalComponent } from './hostpital.component';

describe('HostpitalComponent', () => {
  let component: HostpitalComponent;
  let fixture: ComponentFixture<HostpitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostpitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostpitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
