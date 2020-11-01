import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimmComponent } from './simm.component';

describe('SimmComponent', () => {
  let component: SimmComponent;
  let fixture: ComponentFixture<SimmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
