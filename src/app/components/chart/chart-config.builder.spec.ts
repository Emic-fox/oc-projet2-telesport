import { ChartConfigBuilder } from './chart-config.builder';

describe('ChartConfigBuilder', () => {
  it('builds a single line serie with the default first palette color', () => {
    const { labels, datasets } = new ChartConfigBuilder('line')
      .addSerie('medals', { 2012: 3, 2016: 5 })
      .build();

    expect(labels).toEqual(['2012', '2016']);
    expect(datasets).toEqual([
      { label: 'medals', data: [3, 5], backgroundColor: 'var(--color-primary)' },
    ]);
  });

  it('cycles the palette across multiple line series and allows overriding a color', () => {
    const { labels, datasets } = new ChartConfigBuilder('line')
      .addSerie('France', { 2012: 3, 2016: 5 })
      .addSerie('Germany', { 2012: 2 }, '#123456')
      .build();

    expect(labels).toEqual(['2012', '2016']);
    expect(datasets).toEqual([
      { label: 'France', data: [3, 5], backgroundColor: 'var(--color-primary)' },
      { label: 'Germany', data: [2, 0], backgroundColor: '#123456' },
    ]);
  });

  it('merges categories across series that do not share the exact same keys', () => {
    const { labels, datasets } = new ChartConfigBuilder('line')
      .addSerie('A', { x: 1, y: 2 })
      .addSerie('B', { y: 3, z: 4 })
      .build();

    expect(labels).toEqual(['x', 'y', 'z']);
    expect(datasets[0].data).toEqual([1, 2, 0]);
    expect(datasets[1].data).toEqual([0, 3, 4]);
  });

  it('builds a pie serie with one default color per category', () => {
    const { labels, datasets } = new ChartConfigBuilder('pie')
      .addSerie('Medals', { France: 8, Germany: 2 })
      .build();

    expect(labels).toEqual(['France', 'Germany']);
    expect(datasets).toEqual([
      {
        label: 'Medals',
        data: [8, 2],
        backgroundColor: ['var(--color-primary)', '#adc3de'],
      },
    ]);
  });

  it('lets a pie serie override the default palette', () => {
    const { datasets } = new ChartConfigBuilder('pie')
      .addSerie('Medals', { France: 8, Germany: 2 }, ['#0b868f', '#adc3de'])
      .build();

    expect(datasets[0].backgroundColor).toEqual(['#0b868f', '#adc3de']);
  });

  it('lets a pie serie map colors explicitly per category, falling back to the palette for the rest', () => {
    const { datasets } = new ChartConfigBuilder('pie')
      .addSerie('Medals', { France: 8, Germany: 2, Italy: 1 }, { Germany: '#123456' })
      .build();

    expect(datasets[0].backgroundColor).toEqual(['var(--color-primary)', '#123456', '#7a3c53']);
  });

  it('throws when adding a second serie to a pie builder', () => {
    const builder = new ChartConfigBuilder('pie').addSerie('Medals', { France: 8 });

    expect(() => builder.addSerie('Other', { France: 1 })).toThrowError(
      'A pie chart can only have one series. Use a line chart for multiple series.',
    );
  });
});
