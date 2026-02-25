import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPricing } from './add-pricing';

describe('AddPricing', () => {
  let component: AddPricing;
  let fixture: ComponentFixture<AddPricing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPricing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPricing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
