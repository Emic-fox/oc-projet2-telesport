import { ChartConfig, ChartType, DataLabel, DataValue } from './chart.component';

const DEFAULT_PALETTE: string[] = [
  'var(--color-primary)',
  '#adc3de',
  '#7a3c53',
  '#8f6263',
  'orange',
  '#94819d',
  '#4a7c6f',
  '#c9a26d',
  '#5c6b8a',
];

type BackgroundColorInput = string | string[] | Record<DataLabel, string>;

/**
 * Construit un ChartConfig prêt à être bindé sur ChartComponent, à partir de séries
 * exprimées comme { catégorie: valeur } plutôt que des tableaux labels/data séparés à garder synchronisés.
 */
export class ChartConfigBuilder {
  private readonly categoryLabels: DataLabel[] = [];
  private readonly series: {
    label: string;
    values: Map<DataLabel, DataValue>;
    backgroundColor?: BackgroundColorInput;
  }[] = [];
  private xAxisLabel?: string;
  private aspectRatio?: number;

  constructor(
    private readonly type: ChartType,
    private readonly palette: string[] = DEFAULT_PALETTE,
  ) {}

  addSerie(label: string, data: Record<DataLabel, DataValue>, backgroundColor?: BackgroundColorInput): this {
    if (this.type === 'pie' && this.series.length >= 1) {
      throw new Error('A pie chart can only have one series. Use a line chart for multiple series.');
    }

    for (const key of Object.keys(data)) {
      if (!this.categoryLabels.includes(key)) {
        this.categoryLabels.push(key);
      }
    }
    this.series.push({ label, values: new Map(Object.entries(data)), backgroundColor });
    return this;
  }

  setXAxisLabel(xAxisLabel: string): this {
    this.xAxisLabel = xAxisLabel;
    return this;
  }

  setAspectRatio(aspectRatio: number): this {
    this.aspectRatio = aspectRatio;
    return this;
  }

  build(): ChartConfig {
    const datasets = this.series.map((serie, index) => ({
      label: serie.label,
      data: this.categoryLabels.map((l) => serie.values.get(l) ?? 0),
      backgroundColor: this.resolveBackgroundColor(serie.backgroundColor, index),
    }));

    return {
      type: this.type,
      labels: this.categoryLabels,
      datasets,
      xAxisLabel: this.xAxisLabel,
      aspectRatio: this.aspectRatio,
    };
  }

  // Pas de couleur fournie -> palette par défaut.
  // Un Record<catégorie, couleur> permet de surcharger certaines catégories seulement (les autres retombant sur la palette).
  // Une string/string[] est renvoyée telle quelle (couleur ou tableau de couleurs positionnel déjà prêt pour Chart.js).
  private resolveBackgroundColor(backgroundColor: BackgroundColorInput | undefined, serieIndex: number): string | string[] {
    if (backgroundColor === undefined) {
      return this.type === 'pie'
        ? this.categoryLabels.map((_, i) => this.paletteColorFor(serieIndex, i))
        : this.paletteColorFor(serieIndex, 0);
    }
    if (this.isColorMap(backgroundColor)) {
      return this.categoryLabels.map((l, i) => backgroundColor[l] ?? this.paletteColorFor(serieIndex, i));
    }
    return backgroundColor;
  }

  private isColorMap(value: BackgroundColorInput): value is Record<DataLabel, string> {
    return !Array.isArray(value) && typeof value !== 'string';
  }

  // Un pie n'a qu'une série mais plusieurs catégories (une couleur par part) : on cycle la palette
  // sur l'index de catégorie. Un line a plusieurs séries mais une seule couleur chacune : on cycle sur l'index de série.
  private paletteColorFor(serieIndex: number, categoryIndex: number): string {
    return this.type === 'pie'
      ? this.palette[categoryIndex % this.palette.length]
      : this.palette[serieIndex % this.palette.length];
  }
}
