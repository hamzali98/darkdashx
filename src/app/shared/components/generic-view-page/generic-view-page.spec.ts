import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericViewPage } from './generic-view-page';

describe('GenericViewPage', () => {
  let component: GenericViewPage;
  let fixture: ComponentFixture<GenericViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
