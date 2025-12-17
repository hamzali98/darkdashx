import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmCharts } from './am-charts';

describe('AmCharts', () => {
  let component: AmCharts;
  let fixture: ComponentFixture<AmCharts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmCharts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmCharts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
