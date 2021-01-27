import { ChangeDetectorRef, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import {
    parseDieCostSymbol,
    parseDieCostValue,
    parseDieSymbol,
    parseDieValue, parseHasDie,
    parseIsFeral,
    parseIsModifier
} from './die/die.utils';

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
        googleSheetCSV: new FormControl('https://docs.google.com/spreadsheets/d/e/2PACX-1vTOWSUVSfCFrnN8H3mJ' +
            '8XSEwbjBaANTW6_Pwdcu8e0qymd_TUUwRGNlmvYYg3Ibi0MitJ1MJh49nm4d/pub?gid=0&single=true&output=csv'),
        number: new FormControl('WH053'),
        rarity: new FormControl('LEGENDARY'),
        title: new FormControl('BLACK KRRSANTAN'),
        subtitle: new FormControl('FEROCIOUS GLADIATOR'),
        life: new FormControl('13'),
        unique: new FormControl(true),
        affiliation: new FormControl('VILLAIN'),
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

    currentCard = 0;
    cardCollection = [];

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
                    this.cardCollection = this.papa.parse(result).data.splice(1).map(card => {
                        return {
                            googleSheetCSV: '',
                            number: card[0],
                            rarity: card[1],
                            title: card[2],
                            subtitle: card[3],
                            type: card[4],
                            subtype: card[5],
                            cardText: card[6],
                            side1: {
                                value: parseDieValue(card[7]),
                                symbol: parseDieSymbol(card[8]),
                                costValue: parseDieCostValue(card[9]),
                                costSymbol: parseDieCostSymbol(card[9]),
                                isModifier: parseIsModifier(card[7]),
                                isFeral: parseIsFeral(card[7])
                            },
                            side2: {
                                value: parseDieValue(card[10]),
                                symbol: parseDieSymbol(card[11]),
                                costValue: parseDieCostValue(card[12]),
                                costSymbol: parseDieCostSymbol(card[12]),
                                isModifier: parseIsModifier(card[10]),
                                isFeral: parseIsFeral(card[10])
                            },
                            side3: {
                                value: parseDieValue(card[13]),
                                symbol: parseDieSymbol(card[14]),
                                costValue: parseDieCostValue(card[15]),
                                costSymbol: parseDieCostSymbol(card[15]),
                                isModifier: parseIsModifier(card[13]),
                                isFeral: parseIsFeral(card[13])
                            },
                            side4: {
                                value: parseDieValue(card[16]),
                                symbol: parseDieSymbol(card[17]),
                                costValue: parseDieCostValue(card[18]),
                                costSymbol: parseDieCostSymbol(card[18]),
                                isModifier: parseIsModifier(card[16]),
                                isFeral: parseIsFeral(card[16])
                            },
                            side5: {
                                value: parseDieValue(card[19]),
                                symbol: parseDieSymbol(card[20]),
                                costValue: parseDieCostValue(card[21]),
                                costSymbol: parseDieCostSymbol(card[21]),
                                isModifier: parseIsModifier(card[19]),
                                isFeral: parseIsFeral(card[19])
                            },
                            side6: {
                                value: parseDieValue(card[22]),
                                symbol: parseDieSymbol(card[23]),
                                costValue: parseDieCostValue(card[24]),
                                costSymbol: parseDieCostSymbol(card[24]),
                                isModifier: parseIsModifier(card[22]),
                                isFeral: parseIsFeral(card[22])
                            },
                            affiliation: card[25],
                            color: card[26],
                            cardCost: card[27],
                            life: card[28],
                            teamCost: card[29],
                            unique: card[30] === 'TRUE',
                            hasDie: parseHasDie(card),
                            cardImage: card[31]
                        };
                    });

                    this.currentCard = 0;

                    this.updateForm(this.currentCard);
                });
        }
    }

    nextCard() {
        if (this.cardCollection.length) {
            this.currentCard++;

            if (this.currentCard > this.cardCollection.length) {
                this.currentCard = 0;
            }

            this.updateForm(this.currentCard);
        }
    }

    prevCard() {
        if (this.cardCollection.length) {
            this.currentCard--;

            if (this.currentCard < 0) {
                this.currentCard = this.cardCollection.length - 1;
            }

            this.updateForm(this.currentCard);
        }
    }

    updateForm(cardNumber) {
        this.cardForm.setValue(this.cardCollection[cardNumber]);
    }

    renderCanvas() {
        window.scrollTo(0, 0);
        html2canvas(this.cardElement.nativeElement.querySelector('swd-card'), {
            width: 705,
            height: 1000
        }).then((canvas) => {
            document.body.appendChild(canvas);

            const formValue = this.cardForm.value;
            const link = document.createElement('a');
            link.download = formValue.title
                ? `${formValue.number}-${formValue.title.split(' ').join('-').toLowerCase()}.png`
                : 'filename.png';
            link.href = canvas.toDataURL();
            link.click();

            document.body.removeChild(canvas);
        });
    }
}
