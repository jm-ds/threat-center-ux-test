import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedAssetsReportComponent } from './embedded-assets-report.component';

describe('EmbeddedAssetsReportComponent', () => {
  let component: EmbeddedAssetsReportComponent;
  let fixture: ComponentFixture<EmbeddedAssetsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbeddedAssetsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedAssetsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
