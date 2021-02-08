import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixComponentResultDialog } from './fix-component-result-dialog';

describe('FixResultComponent', () => {
  let component: FixComponentResultDialog;
  let fixture: ComponentFixture<FixComponentResultDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixComponentResultDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixComponentResultDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
