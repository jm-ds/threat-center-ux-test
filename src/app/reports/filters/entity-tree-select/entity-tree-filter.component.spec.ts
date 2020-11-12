import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTreeFilterComponent } from './entity-tree-filter.component';

describe('EntityTreeFilterComponent', () => {
  let component: EntityTreeFilterComponent;
  let fixture: ComponentFixture<EntityTreeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityTreeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTreeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
