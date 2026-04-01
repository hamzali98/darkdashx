import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDropMenu } from './generic-drop-menu';

describe('GenericDropMenu', () => {
  let component: GenericDropMenu;
  let fixture: ComponentFixture<GenericDropMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericDropMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericDropMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
