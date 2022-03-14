import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgnoreFilesEditComponent } from './ignore-files-edit.component';

describe('UserEditComponent', () => {
  let component: IgnoreFilesEditComponent;
  let fixture: ComponentFixture<IgnoreFilesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgnoreFilesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgnoreFilesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
