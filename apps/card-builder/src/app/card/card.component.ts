import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'swd-card',
    templateUrl: './card.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CardComponent implements OnChanges {
    @ViewChild('headerElement') headerElement: ElementRef;
    @ViewChild('cardImageElement', { static: true }) cardImageElement: ElementRef;
    @ViewChild('cardBackElement', { static: true }) cardBackElement: ElementRef;

    @Input() data: any;
    @Output() cardLoaded: EventEmitter<null> = new EventEmitter<null>();

    maxTextHeight = {
        BATTLEFIELD: 175,
        PLOT: 175,
        CHARACTER: 230,
        DICELESS_CHARACTER: 210,
        UPGRADE: 230,
        DOWNGRADE: 230,
        SUPPORT: 230,
        EVENT: 190
    };

    isMultiline = false;
    isLoadingImage = false;
    timeoutId;
    countLinesId;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
            this.isMultiline = false;
            if (changes['data'].previousValue &&
                changes['data'].previousValue.cardImage !== this.data.cardImage
            ) {
                this.isLoadingImage = true;
            } else {
                clearTimeout(this.timeoutId);
                this.timeoutId = setTimeout(() => this.onLoadImage(), 1000);
            }
            clearTimeout(this.countLinesId);
            this.countLinesId = setTimeout(() => (this.isMultiline = this.countLines() > 1), 10);
        }
    }

    onLoadImage() {
        this.isLoadingImage = false;
        this.cardLoaded.emit();
    }

    countLines() {
        if (this.headerElement) {
            const elem = this.headerElement.nativeElement;
            const elemHeight = elem.offsetHeight;
            const lineHeight = parseInt(window.getComputedStyle(elem).getPropertyValue('line-height'));
            return elemHeight / lineHeight;
        } else {
            return 0;
        }
    }
}
