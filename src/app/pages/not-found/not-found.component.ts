import { Component } from '@angular/core';
import { BackLinkComponent } from '@components/back-link/back-link.component';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    standalone: true,
    imports: [BackLinkComponent]
})
export class NotFoundComponent {

}
