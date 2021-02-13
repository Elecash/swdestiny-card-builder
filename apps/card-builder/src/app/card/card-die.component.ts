import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'swd-card-die-side',
    templateUrl: './card-die.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CardDieSideComponent {
    @Input() data: any;
}
