import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentSliderComponent } from './content-slider.component';

describe('ContentSliderComponent', () => {
  let component: ContentSliderComponent;
  let fixture: ComponentFixture<ContentSliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
