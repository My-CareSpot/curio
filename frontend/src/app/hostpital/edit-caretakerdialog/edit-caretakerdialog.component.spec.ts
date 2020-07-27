import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCaretakerdialogComponent } from './edit-caretakerdialog.component';

describe('EditCaretakerdialogComponent', () => {
  let component: EditCaretakerdialogComponent;
  let fixture: ComponentFixture<EditCaretakerdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCaretakerdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCaretakerdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
