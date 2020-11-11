import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateIntervalFilterComponent } from './date-interval-filter.component';

describe('DateIntervalFilterComponent', () => {
  let component: DateIntervalFilterComponent;
  let fixture: ComponentFixture<DateIntervalFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateIntervalFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateIntervalFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
