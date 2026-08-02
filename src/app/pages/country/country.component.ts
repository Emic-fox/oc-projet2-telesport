import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BackLinkComponent } from '@components/back-link/back-link.component';
import { StatCardComponent } from '@components/stat-card/stat-card.component';
import { DashboardLayoutComponent } from '@components/dashboard-layout/dashboard-layout.component';
import { ChartComponent } from '@components/chart/chart.component';


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
  public totalEntries: any = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public error!: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
  }

  ngOnInit() {
    let countryName: string | null = null
    this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
    this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
      (data) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find((i: any) => i.country === countryName);
          this.titlePage = selectedCountry.country;
          const participations = selectedCountry?.participations.map((i: any) => i);
          this.totalEntries = participations?.length ?? 0;
          this.years = selectedCountry?.participations.map((i: any) => i.year) ?? [];
          this.medals = selectedCountry?.participations.map((i: any) => i.medalsCount) ?? [];
          this.totalMedals = this.medals.reduce((accumulator: any, item: any) => accumulator + item, 0);
          const nbAthletes = selectedCountry?.participations.map((i: any) => i.athleteCount) ?? []
          this.totalAthletes = nbAthletes.reduce((accumulator: any, item: any) => accumulator + item, 0);
        }
      },
      (error: HttpErrorResponse) => {
        this.error = error.message
      }
    );
  }
}
