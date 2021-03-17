import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixComponentDialogComponent } from './fix-component-dialog.component';

describe('FixComponentDialogComponent', () => {
  let component: FixComponentDialogComponent;
  let fixture: ComponentFixture<FixComponentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixComponentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
