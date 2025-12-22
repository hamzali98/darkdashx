import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataError } from './data-error';

describe('DataError', () => {
  let component: DataError;
  let fixture: ComponentFixture<DataError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
