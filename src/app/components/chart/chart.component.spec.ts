import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ActiveElement, ChartConfiguration, ChartEvent } from 'chart.js/auto';

import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should build a line chart by default', () => {
    fixture.detectChanges();
    expect((component['chart']?.config as ChartConfiguration).type).toBe('line');
  });

  it('should build a pie chart when type is pie', () => {
    component.config = { type: 'pie', labels: [], datasets: [] };
    fixture.detectChanges();
    expect((component['chart']?.config as ChartConfiguration).type).toBe('pie');
  });

  it('should rebuild the chart when inputs change', () => {
    fixture.detectChanges();
    const firstChart = component['chart'];
    const destroySpy = spyOn(firstChart!, 'destroy').and.callThrough();

    component.config = { type: 'line', labels: [], datasets: [{ label: 'series', data: [1, 2, 3] }] };
    component.ngOnChanges();

    expect(destroySpy).toHaveBeenCalled();
    expect(component['chart']).not.toBe(firstChart);
  });

  it('should destroy the chart on component destroy', () => {
    fixture.detectChanges();
    const destroySpy = spyOn(component['chart']!, 'destroy').and.callThrough();

    fixture.destroy();

    expect(destroySpy).toHaveBeenCalled();
  });

  it('should emit pointClick when a point is clicked', () => {
    component.config = {
      type: 'pie',
      labels: ['2020', '2021'],
      datasets: [{ label: 'series', data: [1, 2] }],
    };
    fixture.detectChanges();

    const chart = component['chart']!;
    const activeElement: ActiveElement = { datasetIndex: 0, index: 1, element: chart.getDatasetMeta(0).data[1] };
    spyOn(chart, 'getElementsAtEventForMode').and.returnValue([activeElement]);
    spyOn(component.pointClick, 'emit');

    const event: ChartEvent = { type: 'click', native: new MouseEvent('click'), x: 0, y: 0 };
    chart.options.onClick?.(event, [activeElement], chart);

    expect(component.pointClick.emit).toHaveBeenCalledWith({ index: 1, label: '2021' });
  });

  describe('resolveColor', () => {
    it('should return the color unchanged when it is not a CSS var()', () => {
      fixture.detectChanges();
      expect(component['resolveColor']('#ff0000')).toBe('#ff0000');
    });

    it('should resolve a CSS var() to its computed value', () => {
      fixture.detectChanges();
      component.canvasRef.nativeElement.style.setProperty('--color-primary', 'rgb(1, 2, 3)');

      expect(component['resolveColor']('var(--color-primary)')).toBe('rgb(1, 2, 3)');
    });

    it('should resolve each color in an array', () => {
      fixture.detectChanges();
      component.canvasRef.nativeElement.style.setProperty('--color-primary', 'rgb(1, 2, 3)');

      expect(component['resolveColor'](['var(--color-primary)', '#00ff00'])).toEqual([
        'rgb(1, 2, 3)',
        '#00ff00',
      ]);
    });
  });
});
