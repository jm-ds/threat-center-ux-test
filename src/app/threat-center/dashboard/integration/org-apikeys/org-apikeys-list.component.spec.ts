import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgApiKeysComponent } from './org-apikeys-list.component';

describe('OrgApiKeysComponent', () => {
  let component: OrgApiKeysComponent;
  let fixture: ComponentFixture<OrgApiKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgApiKeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgApiKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});