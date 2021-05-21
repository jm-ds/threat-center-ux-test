import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertEmailsComponent } from './alert-emails.component';

describe('AlertEmailsComponent', () => {
  let component: AlertEmailsComponent;
  let fixture: ComponentFixture<AlertEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});