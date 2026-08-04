import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BackLinkComponent } from '@components/back-link/back-link.component';
import { StatCardComponent } from '@components/stat-card/stat-card.component';
import { DashboardLayoutComponent } from '@components/dashboard-layout/dashboard-layout.component';
import { ChartComponent } from '@components/chart/chart.component';
import { ErrorMessageComponent } from '@components/error-message/error-message.component';
import { DataService } from '@services/data.service';
import { OlympicDataError } from '@app/models/Errors';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  standalone: true,
  imports: [
    BackLinkComponent,
    StatCardComponent,
    DashboardLayoutComponent,
    ChartComponent,
    ErrorMessageComponent,
  ]
})
export class CountryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);

  public titlePage = '';
  public years: number[] = [];
  public medals: number[] = [];
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error!: string;
  public notFound = false;

  ngOnInit() {
    let countryName: string | null = null
    this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
    this.titlePage = countryName ?? '';

    this.dataService
      .getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            const selectedCountry = data.find(o => o.country === countryName);
            if (!selectedCountry) {
              this.notFound = true;
              return;
            }
            this.totalEntries = selectedCountry.participations.length;
            this.years = selectedCountry.participations.map(p => p.year);
            this.medals = selectedCountry.participations.map(p => p.medalsCount);
            this.totalMedals = this.medals.reduce((acc, i) => acc + i, 0);
            const nbAthletes = selectedCountry.participations.map(p => p.athleteCount);
            this.totalAthletes = nbAthletes.reduce((acc, i) => acc + i, 0);
          }
        },
        error: (error: OlympicDataError) => {
          this.error = error.message;
        },
      });
  }
}
