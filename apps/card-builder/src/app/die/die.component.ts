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
    selector: 'swd-die',
    templateUrl: './die.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DieComponent implements OnChanges {
    @ViewChild('cardImageElement', { static: true }) cardImageElement: ElementRef;

    @Input() data: any;
    @Input() side: any;
    @Output() dieLoaded: EventEmitter<null> = new EventEmitter<null>();

    isLoadingImage = false;
    timeoutId;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
            if (changes['data'].previousValue &&
                changes['data'].previousValue.cardImage !== this.data.cardImage
            ) {
                this.isLoadingImage = true;
            } else {
                clearTimeout(this.timeoutId);
                this.timeoutId = setTimeout(() => this.onLoadImage(), 1000);
            }
        }
    }

    onLoadImage() {
        this.isLoadingImage = false;
        this.dieLoaded.emit();
    }
}
