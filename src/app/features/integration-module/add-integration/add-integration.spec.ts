import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntegration } from './add-integration';

describe('AddIntegration', () => {
  let component: AddIntegration;
  let fixture: ComponentFixture<AddIntegration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIntegration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIntegration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
