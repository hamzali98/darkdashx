import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericChildNavBar } from './generic-child-nav-bar';

describe('GenericChildNavBar', () => {
  let component: GenericChildNavBar;
  let fixture: ComponentFixture<GenericChildNavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericChildNavBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericChildNavBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
