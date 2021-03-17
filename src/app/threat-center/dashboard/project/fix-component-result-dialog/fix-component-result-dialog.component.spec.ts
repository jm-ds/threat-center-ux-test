import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixComponentResultDialogComponent } from './fix-component-result-dialog.component';

describe('FixResultComponent', () => {
  let component: FixComponentResultDialogComponent;
  let fixture: ComponentFixture<FixComponentResultDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixComponentResultDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixComponentResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
