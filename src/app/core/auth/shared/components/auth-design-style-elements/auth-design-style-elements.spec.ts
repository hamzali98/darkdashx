import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthDesignStyleElements } from './auth-design-style-elements';

describe('AuthDesignStyleElements', () => {
  let component: AuthDesignStyleElements;
  let fixture: ComponentFixture<AuthDesignStyleElements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthDesignStyleElements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthDesignStyleElements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
