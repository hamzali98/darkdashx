import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderDevSvg } from './under-dev-svg';

describe('UnderDevSvg', () => {
  let component: UnderDevSvg;
  let fixture: ComponentFixture<UnderDevSvg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderDevSvg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnderDevSvg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
