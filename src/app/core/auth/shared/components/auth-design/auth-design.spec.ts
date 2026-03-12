import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDesign } from './auth-design';

describe('PageDesign', () => {
  let component: PageDesign;
  let fixture: ComponentFixture<PageDesign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageDesign]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageDesign);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
