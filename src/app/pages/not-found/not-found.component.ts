import { Component } from '@angular/core';
import { BackLinkComponent } from '@components/back-link/back-link.component';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    standalone: true,
    imports: [BackLinkComponent],
    host: { class: 'flex-grow-1 d-flex flex-column justify-center align-items-center p-2' },
})
export class NotFoundComponent {

}
