import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DataService } from './data.service';
import { OlympicDataError } from '@app/models/Errors';
import { Olympic } from '@app/models/Olympic';
import { environment } from 'src/environments/environment';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  const mockOlympics: Olympic[] = [
    {
      id: 1,
      country: 'France',
      participations: [
        { id: 1, year: 2012, city: 'London', medalsCount: 3, athleteCount: 12 },
      ],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch olympics data from the API', (done) => {
    service.getOlympics().subscribe((data) => {
      expect(data).toEqual(mockOlympics);
      done();
    });

    const req = httpMock.expectOne(environment.olympicUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockOlympics);
  });

  it('should share a single HTTP call across multiple subscribers', () => {
    let firstResult: Olympic[] | undefined;
    let secondResult: Olympic[] | undefined;

    service.getOlympics().subscribe((data) => (firstResult = data));
    service.getOlympics().subscribe((data) => (secondResult = data));

    const req = httpMock.expectOne(environment.olympicUrl);
    req.flush(mockOlympics);

    expect(firstResult).toEqual(mockOlympics);
    expect(secondResult).toEqual(mockOlympics);
  });

  it('should throw an OlympicDataError when the request fails', (done) => {
    service.getOlympics().subscribe({
      next: () => fail('expected an error, not olympics data'),
      error: (error) => {
        expect(error).toBeInstanceOf(OlympicDataError);
        expect(error.message).toBe('Impossible de récupérer les données olympiques.');
        done();
      },
    });

    const req = httpMock.expectOne(environment.olympicUrl);
    req.flush('server error', { status: 500, statusText: 'Server Error' });
  });
});
