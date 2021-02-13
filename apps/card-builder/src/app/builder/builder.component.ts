import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Card } from '../card.interface';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import html2canvas from 'html2canvas';

@Component({
    selector: 'swd-builder',
    templateUrl: 'builder.component.html',
    styleUrls: ['builder.component.scss'],
})
export class BuilderComponent {
    @ViewChild('cardElement', { static: true }) cardElement: ElementRef;
    @ViewChild('dieElement', { static: true }) dieElement: ElementRef;
    @ViewChild('canvasElement', { static: true }) canvasElement: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    cardForm = new FormGroup({
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
        signature: new FormControl('Star Wars Destiny Card Builder'),
        cardText: new FormControl(
            'You can play *wild* upgrades on this character, ignoring play restrictions.' +
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
            isFeral: new FormControl(false),
        }),
        side2: new FormGroup({
            value: new FormControl('4'),
            symbol: new FormControl('A'),
            costValue: new FormControl('1'),
            costSymbol: new FormControl('E'),
            isModifier: new FormControl(false),
            isFeral: new FormControl(false),
        }),
        side3: new FormGroup({
            value: new FormControl('2'),
            symbol: new FormControl('B'),
            costValue: new FormControl('1'),
            costSymbol: new FormControl('C'),
            isModifier: new FormControl(false),
            isFeral: new FormControl(false),
        }),
        side4: new FormGroup({
            value: new FormControl('1'),
            symbol: new FormControl('F'),
            costValue: new FormControl(''),
            costSymbol: new FormControl(''),
            isModifier: new FormControl(false),
            isFeral: new FormControl(false),
        }),
        side5: new FormGroup({
            value: new FormControl('1'),
            symbol: new FormControl('E'),
            costValue: new FormControl(''),
            costSymbol: new FormControl(''),
            isModifier: new FormControl(false),
            isFeral: new FormControl(false),
        }),
        side6: new FormGroup({
            value: new FormControl(''),
            symbol: new FormControl('J'),
            costValue: new FormControl(''),
            costSymbol: new FormControl(''),
            isModifier: new FormControl(false),
            isFeral: new FormControl(false),
        }),
    });

    dataSource: MatTableDataSource<Card>;

    currentCard = 0;
    cardCollection: Card[] = [];
    cardLoaded = false;
    downloadingCollection = false;
    zip;

    gridColumns = ['title', 'type', 'subtype', 'affiliation', 'color'];

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
        { id: '', name: 'None' },
    ];

    costSymbols = [
        { id: 'C', name: 'Indirect' },
        { id: 'E', name: 'Resource' },
    ];

    affiliations = [
        { id: 'HERO', name: 'Hero' },
        { id: 'VILLAIN', name: 'Villain' },
        { id: 'NEUTRAL', name: 'Neutral' },
    ];

    colors = [
        { id: 'GREEN', name: 'Green' },
        { id: 'RED', name: 'Red' },
        { id: 'YELLOW', name: 'Yellow' },
        { id: 'BLUE', name: 'Blue' },
        { id: 'GRAY', name: 'Gray' },
    ];

    rarities = [
        { id: 'STARTER', name: 'Starter' },
        { id: 'COMMON', name: 'Common' },
        { id: 'UNCOMMON', name: 'Uncommon' },
        { id: 'RARE', name: 'Rare' },
        { id: 'LEGENDARY', name: 'Legendary' },
    ];

    types = [
        { id: 'BATTLEFIELD', name: 'Battlefield' },
        { id: 'PLOT', name: 'Plot' },
        { id: 'CHARACTER', name: 'Character' },
        { id: 'UPGRADE', name: 'Upgrade' },
        { id: 'DOWNGRADE', name: 'Downgrade' },
        { id: 'SUPPORT', name: 'Support' },
        { id: 'EVENT', name: 'Event' },
    ];

    ctx: CanvasRenderingContext2D;

    constructor(private cd: ChangeDetectorRef, private http: HttpClient, private papa: Papa) {
        console.log(JSON.stringify(this.cardForm.value));
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

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    goToCard(card: Card) {
        this.currentCard = this.cardCollection.findIndex((c) => c.number === card.number);
        this.updateForm(this.currentCard);
    }

    updateForm(cardNumber) {
        this.cardForm.setValue(this.cardCollection[cardNumber]);
    }

    renderCanvas() {
        let options = {};

        if (this.cardForm.value.type === 'BATTLEFIELD') {
            options = {
                width: 1000,
                height: 705,
            };
        } else {
            options = {
                width: 705,
                height: 1000,
            };
        }
        window.scrollTo(0, 0);
        html2canvas(this.cardElement.nativeElement.querySelector('swd-card'), options).then((canvas) => {
            document.body.appendChild(canvas);
            canvas.classList.add('card-hidden');

            const formValue = this.cardForm.value;
            const filename = `${formValue.number}-${formValue.title.split(' ').join('-').toLowerCase()}.png`;

            const link = document.createElement('a');
            link.download = formValue.title ? filename : 'filename.png';
            link.href = canvas.toDataURL();
            link.click();

            document.body.removeChild(canvas);
        });
    }

    renderDie() {
        window.scrollTo(0, 0);
        html2canvas(this.dieElement.nativeElement, { width: 1300, height: 200, scrollY: 20 }).then(
            (canvas) => {
                document.body.appendChild(canvas);
                canvas.classList.add('card-hidden');

                const formValue = this.cardForm.value;
                const filename = `${formValue.number}-${formValue.title.split(' ').join('-').toLowerCase()}.png`;

                const link = document.createElement('a');
                link.download = formValue.title ? filename : 'filename.png';
                link.href = canvas.toDataURL();
                link.click();

                document.body.removeChild(canvas);
            }
        );
    }
}
