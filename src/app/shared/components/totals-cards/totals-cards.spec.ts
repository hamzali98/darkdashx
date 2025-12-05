import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalsCards } from './totals-cards';

describe('TotalsCards', () => {
  let component: TotalsCards;
  let fixture: ComponentFixture<TotalsCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalsCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalsCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
