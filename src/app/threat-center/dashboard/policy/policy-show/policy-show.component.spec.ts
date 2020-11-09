import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyShowComponent } from './policy-show.component';

describe('PolicyShowComponent', () => {
  let component: PolicyShowComponent;
  let fixture: ComponentFixture<PolicyShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});