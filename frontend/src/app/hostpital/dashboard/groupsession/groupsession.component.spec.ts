import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsessionComponent } from './groupsession.component';

describe('GroupsessionComponent', () => {
  let component: GroupsessionComponent;
  let fixture: ComponentFixture<GroupsessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
