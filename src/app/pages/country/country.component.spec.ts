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

  it('should load the stats of the country from the route param', () => {
    fixture.detectChanges();

    expect(component.titlePage).toBe('France');
    expect(component.totalEntries).toBe(2);
    expect(component.years).toEqual([2012, 2016]);
    expect(component.medals).toEqual([3, 5]);
    expect(component.totalMedals).toBe(8);
    expect(component.totalAthletes).toBe(27);
  });

  it('should set an error message when the data service fails', () => {
    dataServiceSpy.getOlympics.and.returnValue(throwError(() => new OlympicDataError('boom')));

    fixture.detectChanges();

    expect(component.error).toBe('boom');
  });
});
