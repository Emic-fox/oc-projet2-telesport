import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

export interface ChartPointClickEvent {
  index: number;
  label: string;
}

export type DataValue = number;
export type DataLabel = string | number;
export type ChartType = 'pie' | 'line';

export interface ChartDatasetInput {
  label: string;
  data: DataValue[];
  backgroundColor?: string | string[];
}

export interface ChartConfig {
  type: ChartType;
  labels: DataLabel[];
  datasets: ChartDatasetInput[];
  xAxisLabel?: string;
  aspectRatio?: number;
}

const DEFAULT_ASPECT_RATIO = 2.5;

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  template: `<canvas #canvas></canvas>`,
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() config: ChartConfig = { type: 'line', labels: [], datasets: [] };
  @Output() pointClick = new EventEmitter<ChartPointClickEvent>();

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart<ChartType, DataValue[], DataLabel>;

  ngOnChanges(): void {
    if (this.canvasRef) {
      this.buildChart();
    }
  }

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChart(): void {
    this.chart?.destroy();
    this.chart =
      this.config.type === 'pie' ? this.buildPieChart() : this.buildLineChart();
  }

  /** Chart.js dessine sur un canvas et ne peut pas résoudre les var() CSS lui-même, donc on convertit manuellement. */
  private resolveColor(color: string | string[]): string | string[] {
    if (Array.isArray(color)) {
      return color.map((c) => this.resolveColor(c) as string);
    }
    const match = color.match(/^var\((--[\w-]+)\)$/);
    if (!match) {
      return color;
    }
    return getComputedStyle(this.canvasRef.nativeElement)
      .getPropertyValue(match[1])
      .trim();
  }

  private buildPieChart(): Chart<'pie', DataValue[], DataLabel> {
    const chart = new Chart(this.canvasRef.nativeElement, {
      type: 'pie',
      data: {
        labels: this.config.labels,
        datasets: this.config.datasets.map((dataset) => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor: this.resolveColor(dataset.backgroundColor ?? 'var(--color-primary)'),
          hoverOffset: 4,
        })),
      },
      options: {
        aspectRatio: this.config.aspectRatio ?? DEFAULT_ASPECT_RATIO,
        onClick: (e) => {
          if (e.native) {
            const points = chart.getElementsAtEventForMode(
              e.native,
              'point',
              { intersect: true },
              true,
            );
            if (points.length) {
              const index = points[0].index;
              const label = chart.data.labels
                ? String(chart.data.labels[index])
                : '';
              this.pointClick.emit({ index, label });
            }
          }
        },
      },
    });
    return chart;
  }

  private buildLineChart(): Chart<'line', DataValue[], DataLabel> {
    return new Chart(this.canvasRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.config.labels,
        datasets: this.config.datasets.map((dataset) => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor: this.resolveColor(dataset.backgroundColor ?? 'var(--color-primary)'),
        })),
      },
      options: {
        aspectRatio: this.config.aspectRatio ?? DEFAULT_ASPECT_RATIO,
        scales: {
          x: {
            title: {
              display: !!this.config.xAxisLabel,
              text: this.config.xAxisLabel,
            },
          },
        },
      },
    });
  }
}
