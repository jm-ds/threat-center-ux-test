import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceDimensionComponent } from './source-dimension.component';

describe('SourceDimensionComponent', () => {
  let component: SourceDimensionComponent;
  let fixture: ComponentFixture<SourceDimensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceDimensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceDimensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
