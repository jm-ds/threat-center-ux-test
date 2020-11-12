import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsReportComponent } from './components-report.component';

describe('ComponentsReportComponent', () => {
  let component: ComponentsReportComponent;
  let fixture: ComponentFixture<ComponentsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
