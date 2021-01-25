import { ChangeDetectorRef, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';

@Component({
    selector: 'swd-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    @ViewChild('cardElement', { static: true }) cardElement: ElementRef;
    @ViewChild('canvasElement', { static: true }) canvasElement: ElementRef;

    cardForm = new FormGroup({
        googleSheetCSV: new FormControl(''),
        life: new FormControl('13'),
        title: new FormControl('BLACK KRRSANTAN'),
        unique: new FormControl(true),
        subtitle: new FormControl('FEROCIOUS GLADIATOR'),
        affiliation: new FormControl('VILLAIN'),
        rarity: new FormControl('LEGENDARY'),
        number: new FormControl('WH053'),
        color: new FormControl('YELLOW'),
        type: new FormControl('CHARACTER'),
        subtype: new FormControl('WOOKIE - BOUNTY HUNTER'),
        cardImage: new FormControl('assets/053-black-krrsantan.png'),
        cardText: new FormControl('You can play *wild* upgrades on this character, ignoring play restrictions.' +
            '//After the upkeep phase begins, you may deal 3 indirect damage to an opponent unless they discard a ' +
            'support or upgrade they control.'
        ),
        teamCost: new FormControl('15/19'),
        cardCost: new FormControl('2'),
        hasDie: new FormControl(true),
        side1: new FormGroup({
            value: new FormControl('2'),
            symbol: new FormControl('A'),
            costValue: new FormControl(''),
            costSymbol: new FormControl(''),
            isModifier: new FormControl(false),
            isFeral: new FormControl(false)
        }),
        side2: new FormGroup({
            value: new FormControl('4'),
            symbol: new FormControl('A'),
            costValue: new FormControl('1'),
            costSymbol: new FormControl('E'),
            isModifier: new FormControl(false),
            isFeral: new FormControl(false)
        }),
        side3: new FormGroup({
            value: new FormControl('2'),
            symbol: new FormControl('B'),
            costValue: new FormControl('1'),
            costSymbol: new FormControl('C'),
            isModifier: new FormControl(false),
            isFeral: new FormControl(false)
        }),
        side4: new FormGroup({
            value: new FormControl('1'),
            symbol: new FormControl('F'),
            costValue: new FormControl(''),
            costSymbol: new FormControl(''),
            isModifier: new FormControl(false),
            isFeral: new FormControl(false)
        }),
        side5: new FormGroup({
            value: new FormControl('1'),
            symbol: new FormControl('E'),
            costValue: new FormControl(''),
            costSymbol: new FormControl(''),
            isModifier: new FormControl(false),
            isFeral: new FormControl(false)
        }),
        side6: new FormGroup({
            value: new FormControl(''),
            symbol: new FormControl('J'),
            costValue: new FormControl(''),
            costSymbol: new FormControl(''),
            isModifier: new FormControl(false),
            isFeral: new FormControl(false)
        })
    });

    sides = ['1', '2', '3', '4', '5', '6'];

    symbols = [
        { id: 'A', name: 'Melee' },
        { id: 'B', name: 'Ranged' },
        { id: 'C', name: 'Indirect' },
        { id: 'D', name: 'Shield' },
        { id: 'E', name: 'Resource' },
        { id: 'F', name: 'Disrupt' },
        { id: 'G', name: 'Discard' },
        { id: 'H', name: 'Focus' },
        { id: 'I', name: 'Special' },
        { id: 'J', name: 'Blank' },
        { id: '', name: 'None' }
    ];

    costSymbols = [
        { id: 'C', name: 'Indirect' },
        { id: 'E', name: 'Resource' }
    ];

    affiliations = [
        { id: 'HERO', name: 'Hero' },
        { id: 'VILLAIN', name: 'Villain' },
        { id: 'NEUTRAL', name: 'Neutral' }
    ];

    colors = [
        { id: 'GREEN', name: 'Green' },
        { id: 'RED', name: 'Red' },
        { id: 'YELLOW', name: 'Yellow' },
        { id: 'BLUE', name: 'Blue' },
        { id: 'GRAY', name: 'Gray' }
    ];

    rarities = [
        { id: 'STARTER', name: 'Starter' },
        { id: 'COMMON', name: 'Common' },
        { id: 'UNCOMMON', name: 'Uncommon' },
        { id: 'RARE', name: 'Rare' },
        { id: 'LEGENDARY', name: 'Legendary' }
    ];

    types = [
        { id: 'BATTLEFIELD', name: 'Battlefield' },
        { id: 'PLOT', name: 'Plot' },
        { id: 'CHARACTER', name: 'Character' },
        { id: 'UPGRADE', name: 'Upgrade' },
        { id: 'DOWNGRADE', name: 'Downgrade' },
        { id: 'SUPPORT', name: 'Support' },
        { id: 'EVENT', name: 'Event' }
    ];

    ctx: CanvasRenderingContext2D;

    constructor(
        private cd: ChangeDetectorRef,
        private http: HttpClient,
        private papa: Papa
    ) {
    }

    onFileSelected(event) {
        if (typeof FileReader !== 'undefined') {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                this.cardForm.get('cardImage').setValue(e.target.result);
                this.cd.detectChanges();
            };

            reader.readAsDataURL(event.target.files[0]);
        }
    }

    exportCards() {
        const url = this.cardForm.value.googleSheetCSV;
        if (url) {
            this.http
                .get(this.cardForm.value.googleSheetCSV, { responseType: 'text' })
                .subscribe((result) => {
                    console.log(this.papa.parse(result));
                });
        }
    }

    renderCanvas() {
        window.scrollTo(0, 0);
        html2canvas(this.cardElement.nativeElement, {
            width: 705,
            height: 1000
        }).then((canvas) => {
            document.body.appendChild(canvas);

            const link = document.createElement('a');
            link.download = 'filename.png';
            link.href = canvas.toDataURL();
            link.click();

            document.body.removeChild(canvas);
        });
    }
}
