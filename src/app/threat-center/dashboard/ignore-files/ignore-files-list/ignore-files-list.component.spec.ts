import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgnoreFilesListComponent } from './ignore-files-list.component';

describe('UserListComponent', () => {
  let component: IgnoreFilesListComponent;
  let fixture: ComponentFixture<IgnoreFilesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgnoreFilesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgnoreFilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
