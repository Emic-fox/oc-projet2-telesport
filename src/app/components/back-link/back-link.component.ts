import { Component, inject } from '@angular/core';
import { NavigationService } from '@services/navigation.service';

@Component({
  selector: 'app-back-link',
  standalone: true,
  imports: [],
  templateUrl: './back-link.component.html',
  styleUrl: './back-link.component.scss'
})
export class BackLinkComponent {
  private navigationService = inject(NavigationService);

  goBack(): void {
    this.navigationService.goBack();
  }
}
