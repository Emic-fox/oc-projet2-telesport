import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Olympic } from '@app/models/Olympic';
import { OlympicDataError } from '@app/models/Errors';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);
  private olympicUrl = environment.olympicUrl;
  private olympics$: Observable<Olympic[]>;

  constructor() {
    this.olympics$ = this.http.get<Olympic[]>(this.olympicUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(
          () =>
            new OlympicDataError(
              'Unable to fetch Olympic data. Please try again later.',
              error,
            ),
        );
      }),
      shareReplay(1),
    );
  }

  getOlympics() {
    return this.olympics$;
  }
}
