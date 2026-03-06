import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDate } from './custom-date';

describe('CustomDate', () => {
  let component: CustomDate;
  let fixture: ComponentFixture<CustomDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
