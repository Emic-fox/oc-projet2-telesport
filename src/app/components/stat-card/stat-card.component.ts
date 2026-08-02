import { Component, Input } from '@angular/core';
import { CardComponent } from '@components/card/card.component';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  @Input() title?: string;
  @Input() value?: string|number;
}
