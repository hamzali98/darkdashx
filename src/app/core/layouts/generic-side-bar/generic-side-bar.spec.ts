import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSideBar } from './generic-side-bar';

describe('GenericSideBar', () => {
  let component: GenericSideBar;
  let fixture: ComponentFixture<GenericSideBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericSideBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericSideBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
