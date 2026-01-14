import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseInfo } from './base-info';

describe('BaseInfo', () => {
  let component: BaseInfo;
  let fixture: ComponentFixture<BaseInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
