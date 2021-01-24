import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'swd-card',
    templateUrl: './card.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CardComponent implements OnInit {
    @Input() data: any;

    backImage;

    maxTextHeight = {
        BATTLEFIELD: 175,
        PLOT: 175,
        CHARACTER: 230,
        UPGRADE: 230,
        DOWNGRADE: 230,
        SUPPORT: 230,
        EVENT: 190,
    };

    ngOnInit() {
        this.backImage = `assets/${this.data.type.toLowerCase()}-${this.data.color.toLowerCase()}.png`;
    }
}
