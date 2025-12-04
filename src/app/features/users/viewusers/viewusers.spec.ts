import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewusers } from './viewusers';

describe('Viewusers', () => {
  let component: Viewusers;
  let fixture: ComponentFixture<Viewusers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewusers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewusers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
