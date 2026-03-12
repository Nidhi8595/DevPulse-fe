import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechSelector } from './tech-selector';

describe('TechSelector', () => {
  let component: TechSelector;
  let fixture: ComponentFixture<TechSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(TechSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
