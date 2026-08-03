import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { StatCardComponent } from '@components/stat-card/stat-card.component';
import { DashboardLayoutComponent } from '@components/dashboard-layout/dashboard-layout.component';
import { ChartComponent, ChartPointClickEvent } from '@components/chart/chart.component';
import { ErrorMessageComponent } from '@components/error-message/error-message.component';
import { DataService } from '@services/data.service';
import { OlympicDataError } from '@app/models/Errors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    StatCardComponent,
    DashboardLayoutComponent,
    ChartComponent,
    ErrorMessageComponent,
  ],
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);

  public countries: string[] = [];
  public medalsPerCountry: number[] = [];
  public totalCountries = 0
  public totalJOs = 0
  public error!:string
  public titlePage = "Medals per Country";

  ngOnInit() {
    this.dataService
      .getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.totalJOs = Array.from(new Set(data.map((o) => o.participations.map(f => f.year)).flat())).length;
          this.countries = data.map(o => o.country);
          this.totalCountries = this.countries.length;
          const medals = data.map(o => o.participations.map(p => p.medalsCount));
          this.medalsPerCountry = medals.map(i => i.reduce((acc, j) => acc + j, 0));
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
