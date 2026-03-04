import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickAnimation } from './tick-animation';

describe('TickAnimation', () => {
  let component: TickAnimation;
  let fixture: ComponentFixture<TickAnimation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TickAnimation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TickAnimation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
