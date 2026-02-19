import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAmChart } from './users-am-chart';

describe('UsersAmChart', () => {
  let component: UsersAmChart;
  let fixture: ComponentFixture<UsersAmChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersAmChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersAmChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
