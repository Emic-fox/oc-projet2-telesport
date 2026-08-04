import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CardComponent } from '@components/card/card.component';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CardComponent, DecimalPipe],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  @Input() title?: string;
  @Input() value?: number;
}
