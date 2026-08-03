import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

export interface ChartPointClickEvent {
  index: number;
  label: string;
}

type DataValue = number;
type DataLabel = string | number;

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  template: `<canvas #canvas></canvas>`,
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() type: 'pie' | 'line' = 'line';
  @Input() labels: DataLabel[] = [];
  @Input() data: DataValue[] = [];
  @Input() datasetLabel = '';
  @Input() backgroundColor: string | string[] = 'var(--color-primary)';
  @Input() aspectRatio = 2.5;
  @Input() xAxisLabel?: string;
  @Output() pointClick = new EventEmitter<ChartPointClickEvent>();

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart<'pie' | 'line', DataValue[], DataLabel>;

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
      this.type === 'pie' ? this.buildPieChart() : this.buildLineChart();
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
        labels: this.labels,
        datasets: [
          {
            label: this.datasetLabel,
            data: this.data,
            backgroundColor: this.resolveColor(this.backgroundColor),
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: this.aspectRatio,
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
        labels: this.labels,
        datasets: [
          {
            label: this.datasetLabel,
            data: this.data,
            backgroundColor: this.resolveColor(this.backgroundColor),
          },
        ],
      },
      options: {
        aspectRatio: this.aspectRatio,
        scales: {
          x: {
            title: {
              display: !!this.xAxisLabel,
              text: this.xAxisLabel,
            },
          },
        },
      },
    });
  }
}
