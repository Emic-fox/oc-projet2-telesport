import { Component, Input } from '@angular/core';
import { CardComponent } from '@components/card/card.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
  @Input() titlePage = '';
}
