import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPricing } from './view-pricing';

describe('ViewPricing', () => {
  let component: ViewPricing;
  let fixture: ComponentFixture<ViewPricing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPricing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPricing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
