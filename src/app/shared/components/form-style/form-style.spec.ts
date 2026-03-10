import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStyle } from './form-style';

describe('FormStyle', () => {
  let component: FormStyle;
  let fixture: ComponentFixture<FormStyle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStyle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormStyle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
