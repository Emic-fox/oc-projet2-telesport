import { Component, Input } from '@angular/core';
import { CardComponent } from '@components/card/card.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './dashboard-layout.component.html',
  host: { class: 'p-2' }
})
export class DashboardLayoutComponent {
  @Input() titlePage = '';
}
