import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SlackUrlsComponent } from './slack-urls.component';

describe('SlackUrlsComponent', () => {
  let component: SlackUrlsComponent;
  let fixture: ComponentFixture<SlackUrlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlackUrlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlackUrlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});