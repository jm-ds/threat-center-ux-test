import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteShowComponent } from './invite-show.component';

describe('InviteShowComponent', () => {
  let component: InviteShowComponent;
  let fixture: ComponentFixture<InviteShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});