import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'swd-card',
    templateUrl: './card.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CardComponent implements OnChanges {
    @ViewChild('headerElement') headerElement: ElementRef;

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

    isMultiline = false;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
            setTimeout(() => this.isMultiline = this.countLines() > 1, 10);
        }
    }

    countLines() {
        if (this.headerElement) {
            const elem = this.headerElement.nativeElement;
            const elemHeight = elem.offsetHeight;
            const lineHeight = parseInt(window.getComputedStyle(elem).getPropertyValue('line-height'));
            console.log(elemHeight / lineHeight);
            return elemHeight / lineHeight;
        } else {
            return 0;
        }
    }
}
