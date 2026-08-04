import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CountryComponent } from './country.component';
import { DataService } from '@services/data.service';
import { OlympicDataError } from '@app/models/Errors';
import { Olympic } from '@app/models/Olympic';

describe('CountryComponent', () => {
  let component: CountryComponent;
  let fixture: ComponentFixture<CountryComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  const mockOlympics: Olympic[] = [
    {
      id: 1,
      country: 'France',
      participations: [
        { id: 1, year: 2012, city: 'London', medalsCount: 3, athleteCount: 12 },
        { id: 2, year: 2016, city: 'Rio', medalsCount: 5, athleteCount: 15 },
      ],
    },
    {
      id: 2,
      country: 'Germany',
      participations: [
        { id: 3, year: 2012, city: 'London', medalsCount: 2, athleteCount: 10 },
      ],
    },
  ];

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('DataService', ['getOlympics']);
    dataServiceSpy.getOlympics.and.returnValue(of(mockOlympics));

    await TestBed.configureTestingModule({
      imports: [CountryComponent],
      providers: [
        provideRouter([]),
        { provide: DataService, useValue: dataServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ countryName: 'France' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should start in a loading state until the data resolves', () => {
    expect(component.loading).toBe(true);

    fixture.detectChanges();

    expect(component.loading).toBe(false);
  });

  it('should load the stats of the country from the route param', () => {
    fixture.detectChanges();

    expect(component.titlePage).toBe('France');
    expect(component.totalEntries).toBe(2);
    expect(component.chartConfig).toEqual({
      type: 'line',
      labels: ['2012', '2016'],
      datasets: [
        { label: 'Medals', data: [3, 5], backgroundColor: 'var(--color-primary)' },
        { label: 'Athletes', data: [12, 15], backgroundColor: '#adc3de' },
      ],
      xAxisLabel: 'Date',
      aspectRatio: undefined,
    });
    expect(component.totalMedals).toBe(8);
    expect(component.totalAthletes).toBe(27);
  });

  it('should set an error message when the data service fails', () => {
    dataServiceSpy.getOlympics.and.returnValue(throwError(() => new OlympicDataError('boom')));

    fixture.detectChanges();

    expect(component.error).toBe('boom');
    expect(component.loading).toBe(true);
  });

  it('should flag the country as not found instead of keeping default stats', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CountryComponent],
      providers: [
        provideRouter([]),
        { provide: DataService, useValue: dataServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ countryName: 'Unknown' })) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.notFound).toBe(true);
    expect(component.titlePage).toBe('Unknown');
    expect(component.totalEntries).toBe(0);
    expect(component.chartConfig).toBeUndefined();
    expect(component.totalMedals).toBe(0);
    expect(component.totalAthletes).toBe(0);
    // notFound court-circuite avant le passage à loading = false : le loader ne se ré-affiche pas
    // car le template teste notFound avant loading, mais le flag interne reste à true.
    expect(component.loading).toBe(true);
  });
});
