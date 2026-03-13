import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingChart } from './trending-chart';

describe('TrendingChart', () => {
  let component: TrendingChart;
  let fixture: ComponentFixture<TrendingChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingChart],
    }).compileComponents();

    fixture = TestBed.createComponent(TrendingChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
