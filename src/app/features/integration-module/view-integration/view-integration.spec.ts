import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIntegration } from './view-integration';

describe('ViewIntegration', () => {
  let component: ViewIntegration;
  let fixture: ComponentFixture<ViewIntegration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewIntegration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIntegration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
