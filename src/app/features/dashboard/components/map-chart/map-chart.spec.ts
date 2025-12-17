import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapChart } from './map-chart';

describe('MapChart', () => {
  let component: MapChart;
  let fixture: ComponentFixture<MapChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
