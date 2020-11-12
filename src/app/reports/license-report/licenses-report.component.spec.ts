import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensesReportComponent } from './licenses-report.component';

describe('LicensesReportComponent', () => {
  let component: LicensesReportComponent;
  let fixture: ComponentFixture<LicensesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
