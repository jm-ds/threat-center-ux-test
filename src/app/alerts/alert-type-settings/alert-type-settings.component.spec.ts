import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertTypeSettingsComponent } from './alert-type-settings.component';

describe('AlertTypeSettingsComponent', () => {
  let component: AlertTypeSettingsComponent;
  let fixture: ComponentFixture<AlertTypeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertTypeSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertTypeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
