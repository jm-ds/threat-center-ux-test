import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyShowComponent } from './apikey-show.component';

describe('ApiKeyShowComponent', () => {
  let component: ApiKeyShowComponent;
  let fixture: ComponentFixture<ApiKeyShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiKeyShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiKeyShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});