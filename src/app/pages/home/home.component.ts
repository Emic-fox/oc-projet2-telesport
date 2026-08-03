import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { StatCardComponent } from '@components/stat-card/stat-card.component';
import { DashboardLayoutComponent } from '@components/dashboard-layout/dashboard-layout.component';
import { ChartComponent, ChartPointClickEvent } from '@components/chart/chart.component';
import { Olympic } from '@models/Olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    StatCardComponent,
    DashboardLayoutComponent,
    ChartComponent,
  ],
})
export class HomeComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public countries: string[] = [];
  public medalsPerCountry: number[] = [];
  public totalCountries: number = 0
  public totalJOs: number = 0
  public error!:string
  titlePage: string = "Medals per Country";

  constructor(private router: Router, private http:HttpClient) { }

  ngOnInit() {
    this.http.get<Olympic[]>(this.olympicUrl).pipe().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.totalJOs = Array.from(new Set(data.map((o) => o.participations.map(f => f.year)).flat())).length;
          this.countries = data.map(o => o.country);
          this.totalCountries = this.countries.length;
          const medals = data.map(o => o.participations.map(p => p.medalsCount));
          this.medalsPerCountry = medals.map(i => i.reduce((acc, j) => acc + j, 0));
        }
      },
      (error:HttpErrorResponse) => {
        this.error = error.message
      }
    )
  }

  onChartPointClick(event: ChartPointClickEvent) {
    this.router.navigate(['country', event.label]);
  }
}
