import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixResultComponent } from './fix-result.component';

describe('FixResultComponent', () => {
  let component: FixResultComponent;
  let fixture: ComponentFixture<FixResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
