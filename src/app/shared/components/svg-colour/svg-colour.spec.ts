import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgColour } from './svg-colour';

describe('SvgColour', () => {
  let component: SvgColour;
  let fixture: ComponentFixture<SvgColour>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgColour]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgColour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
