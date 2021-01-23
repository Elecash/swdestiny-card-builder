import { Directive, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Directive({
    selector: '[swdAutosize]'
})
export class AutosizeDirective implements OnInit {
    @Input() swdAutosize = 175;
    textContainer: any;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.textContainer = this.elementRef.nativeElement.querySelector('.text-container');
        setTimeout(() => this.resizeToFit(), 100);
    }

    ngAfterViewChecked() {
        this.elementRef.nativeElement.style.fontSize = ``;
        this.elementRef.nativeElement.style.lineHeight = ``;
        this.resizeToFit();
    }

    resizeToFit() {
        const fontSize = isNaN(parseInt(this.elementRef.nativeElement.style.fontSize))
            ? 32
            : parseInt(this.elementRef.nativeElement.style.fontSize);

        if (this.elementRef.nativeElement.clientHeight > this.swdAutosize) {
            this.elementRef.nativeElement.style.fontSize = `${fontSize - 1}px`;
            this.elementRef.nativeElement.style.lineHeight = `${fontSize + 5}px`;
            this.resizeToFit();
        }
    }
}
