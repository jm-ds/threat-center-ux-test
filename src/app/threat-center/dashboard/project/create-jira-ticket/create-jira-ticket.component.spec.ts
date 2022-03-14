import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJiraTicketComponent } from './create-jira-ticket.component';

describe('CreateJiraTicketComponent', () => {
  let component: CreateJiraTicketComponent;
  let fixture: ComponentFixture<CreateJiraTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateJiraTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJiraTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
