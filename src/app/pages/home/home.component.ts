import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { StatCardComponent } from '@components/stat-card/stat-card.component';
import { DashboardLayoutComponent } from '@components/dashboard-layout/dashboard-layout.component';
import { ChartComponent, ChartPointClickEvent } from '@components/chart/chart.component';

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
    this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
      (data) => {
        console.log(`Liste des données : ${JSON.stringify(data)}`);
        if (data && data.length > 0) {
          this.totalJOs = Array.from(new Set(data.map((i: any) => i.participations.map((f: any) => f.year)).flat())).length;
          this.countries = data.map((i: any) => i.country);
          this.totalCountries = this.countries.length;
          const medals = data.map((i: any) => i.participations.map((i: any) => (i.medalsCount)));
          this.medalsPerCountry = medals.map((i) => i.reduce((acc: any, i: any) => acc + i, 0));
        }
      },
      (error:HttpErrorResponse) => {
        console.log(`erreur : ${error}`);
        this.error = error.message
      }
    )
  }

  onChartPointClick(event: ChartPointClickEvent) {
    this.router.navigate(['country', event.label]);
  }
}
