import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BackLinkComponent } from '@components/back-link/back-link.component';
import { StatCardComponent } from '@components/stat-card/stat-card.component';
import { DashboardLayoutComponent } from '@components/dashboard-layout/dashboard-layout.component';
import { ChartComponent } from '@components/chart/chart.component';
import { Olympic } from '@models/Olympic';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  standalone: true,
  imports: [
    BackLinkComponent,
    StatCardComponent,
    DashboardLayoutComponent,
    ChartComponent
  ]
})
export class CountryComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public titlePage: string = '';
  public years: number[] = [];
  public medals: number[] = [];
  public totalEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public error!: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
  }

  ngOnInit() {
    let countryName: string | null = null
    this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
    this.http.get<Olympic[]>(this.olympicUrl).pipe().subscribe(
      (data) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find(o => o.country === countryName);
          this.titlePage = selectedCountry?.country || '';
          this.totalEntries = selectedCountry?.participations.length ?? 0;
          this.years = selectedCountry?.participations.map(p => p.year) ?? [];
          this.medals = selectedCountry?.participations.map(p => p.medalsCount) ?? [];
          this.totalMedals = this.medals.reduce((acc, i) => acc + i, 0);
          const nbAthletes = selectedCountry?.participations.map(p => p.athleteCount) ?? []
          this.totalAthletes = nbAthletes.reduce((acc, i) => acc + i, 0);
        }
      },
      (error: HttpErrorResponse) => {
        this.error = error.message
      }
    );
  }
}
