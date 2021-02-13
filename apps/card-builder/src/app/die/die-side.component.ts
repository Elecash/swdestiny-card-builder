import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'swd-die-side',
    templateUrl: './die-side.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DieSideComponent {
    @Input() data: any;
}
