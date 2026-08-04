import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';
import { DataService } from '@services/data.service';
import { OlympicDataError } from '@app/models/Errors';
import { Olympic } from '@app/models/Olympic';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
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
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: DataService, useValue: dataServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
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

  it('should load olympics data and compute stats on init', () => {
    fixture.detectChanges();

    expect(component.totalCountries).toBe(2);
    expect(component.totalJOs).toBe(2);
    expect(component.chartConfig).toEqual({
      type: 'pie',
      labels: ['France', 'Germany'],
      datasets: [
        {
          label: 'Medals',
          data: [8, 2],
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
        },
      ],
      xAxisLabel: undefined,
      aspectRatio: undefined,
    });
  });

  it('should set an error message when the data service fails', () => {
    dataServiceSpy.getOlympics.and.returnValue(throwError(() => new OlympicDataError('boom')));

    fixture.detectChanges();

    expect(component.error).toBe('boom');
    // le loader ne se ré-affiche pas car le template teste error avant loading,
    // mais le flag interne reste à true (loading = false n'est jamais atteint côté erreur).
    expect(component.loading).toBe(true);
  });

  it('should navigate to the clicked country on chart point click', () => {
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.onChartPointClick({ index: 0, label: 'France' });

    expect(navigateSpy).toHaveBeenCalledWith(['country', 'France']);
  });
});
