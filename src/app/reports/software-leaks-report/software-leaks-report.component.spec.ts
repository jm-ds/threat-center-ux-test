import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareLeaksReportComponent } from './software-leaks-report.component';

describe('SoftwareLeaksReportComponent', () => {
  let component: SoftwareLeaksReportComponent;
  let fixture: ComponentFixture<SoftwareLeaksReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareLeaksReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareLeaksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
