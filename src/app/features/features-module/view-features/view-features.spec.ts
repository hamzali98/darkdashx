import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeatures } from './view-features';

describe('ViewFeatures', () => {
  let component: ViewFeatures;
  let fixture: ComponentFixture<ViewFeatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFeatures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFeatures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
