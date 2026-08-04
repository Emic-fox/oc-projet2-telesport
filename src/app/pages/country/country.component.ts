import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BackLinkComponent } from '@components/back-link/back-link.component';
import { StatCardComponent } from '@components/stat-card/stat-card.component';
import { DashboardLayoutComponent } from '@components/dashboard-layout/dashboard-layout.component';
import { ChartComponent, ChartConfig } from '@components/chart/chart.component';
import { ChartConfigBuilder } from '@components/chart/chart-config.builder';
import { ErrorMessageComponent } from '@components/error-message/error-message.component';
import { LoaderComponent } from "@components/loader/loader.component";
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
    LoaderComponent
]
})
export class CountryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);

  public titlePage = '';
  public chartConfig!: ChartConfig;
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error!: string;
  public notFound = false;
  public loading = true;

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
            this.totalMedals = selectedCountry.participations.reduce((acc, p) => acc + p.medalsCount, 0);
            this.totalAthletes = selectedCountry.participations.reduce((acc, p) => acc + p.athleteCount, 0);

            this.chartConfig = new ChartConfigBuilder('line')
              .addSerie(
                'Medals',
                Object.fromEntries(selectedCountry.participations.map((p) => [p.year, p.medalsCount])),
              )
              .addSerie(
                'Athletes',
                Object.fromEntries(selectedCountry.participations.map((p) => [p.year, p.athleteCount])),
              )
              .setXAxisLabel('Date')
              .build();

            this.loading = false;
          }
        },
        error: (error: OlympicDataError) => {
          this.error = error.message;
        },
      });
  }
}
