import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeatures } from './add-features';

describe('AddFeatures', () => {
  let component: AddFeatures;
  let fixture: ComponentFixture<AddFeatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFeatures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFeatures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
