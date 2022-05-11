import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {UserAccountsComponent} from "@app/admin/user/user-accounts/user-accounts.component";

describe('ApiKeyShowComponent', () => {
  let component: UserAccountsComponent;
  let fixture: ComponentFixture<UserAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});