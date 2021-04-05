import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyEditComponent } from './apikey-edit.component';

describe('ApiKeyEditComponent', () => {
  let component: ApiKeyEditComponent;
  let fixture: ComponentFixture<ApiKeyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiKeyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiKeyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});