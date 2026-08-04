import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { StatCardComponent } from '@components/stat-card/stat-card.component';
import { DashboardLayoutComponent } from '@components/dashboard-layout/dashboard-layout.component';
import { ChartComponent, ChartConfig, ChartPointClickEvent } from '@components/chart/chart.component';
import { ChartConfigBuilder } from '@components/chart/chart-config.builder';
import { ErrorMessageComponent } from '@components/error-message/error-message.component';
import { LoaderComponent } from '@components/loader/loader.component';
import { DataService } from '@services/data.service';
import { OlympicDataError } from '@app/models/Errors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    StatCardComponent,
    DashboardLayoutComponent,
    ChartComponent,
    ErrorMessageComponent,
    LoaderComponent
  ],
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);

  public titlePage = "Medals per Country";
  public chartConfig!: ChartConfig;
  public totalCountries = 0
  public totalJOs = 0
  public error!: string
  public loading = true

  ngOnInit() {
    this.dataService
      .getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.totalJOs = Array.from(new Set(data.map((o) => o.participations.map(f => f.year)).flat())).length;
          this.totalCountries = data.length;

          this.chartConfig = new ChartConfigBuilder('pie')
            .addSerie('Medals', Object.fromEntries(
              data.map(o => [o.country, o.participations.reduce((acc, p) => acc + p.medalsCount, 0)]),
            ))
            .build();

          this.loading = false;
        },
        error: (error: OlympicDataError) => {
          this.error = error.message;
        },
      });
  }

  onChartPointClick(event: ChartPointClickEvent) {
    this.router.navigate(['country', event.label]);
  }
}
