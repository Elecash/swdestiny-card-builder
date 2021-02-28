import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Card } from '../card.interface';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import {
    parseDieCostSymbol,
    parseDieCostValue,
    parseDieSymbol,
    parseDieValue,
    parseHasDie,
    parseIsFeral,
    parseIsModifier,
} from '../utils/die.utils';
import { environment } from '../../environments/environment';
import * as JSZip from 'jszip';
import html2canvas from 'html2canvas';

@Component({
    selector: 'swd-export-tool',
    templateUrl: 'export-tool.component.html',
    styleUrls: ['export-tool.component.scss'],
})
export class ExportToolComponent {
    @ViewChild('cardElement', { static: false }) cardElement: ElementRef;
    @ViewChild('dieElement', { static: false }) dieElement: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    cardData: any;

    dataSource: MatTableDataSource<Card>;

    currentCard = 0;
    cardCollection: Card[] = [];
    downloadingCollection = false;
    loading = false;
    zip;
    zipDice;

    gridColumns = ['title', 'type', 'subtype', 'affiliation', 'color'];

    constructor(private cd: ChangeDetectorRef, private http: HttpClient, private papa: Papa) {}

    importCards(url: string) {
        if (url) {
            this.loading = true;
            this.cardCollection = [];

            this.http.get(url, { responseType: 'text' }).subscribe((result) => {
                this.loading = false;
                this.cardCollection = this.papa
                    .parse(result)
                    .data.splice(1)
                    .map((card) => {
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
                                isFeral: parseIsFeral(card[7]),
                            },
                            side2: {
                                value: parseDieValue(card[10]),
                                symbol: parseDieSymbol(card[11]),
                                costValue: parseDieCostValue(card[12]),
                                costSymbol: parseDieCostSymbol(card[12]),
                                isModifier: parseIsModifier(card[10]),
                                isFeral: parseIsFeral(card[10]),
                            },
                            side3: {
                                value: parseDieValue(card[13]),
                                symbol: parseDieSymbol(card[14]),
                                costValue: parseDieCostValue(card[15]),
                                costSymbol: parseDieCostSymbol(card[15]),
                                isModifier: parseIsModifier(card[13]),
                                isFeral: parseIsFeral(card[13]),
                            },
                            side4: {
                                value: parseDieValue(card[16]),
                                symbol: parseDieSymbol(card[17]),
                                costValue: parseDieCostValue(card[18]),
                                costSymbol: parseDieCostSymbol(card[18]),
                                isModifier: parseIsModifier(card[16]),
                                isFeral: parseIsFeral(card[16]),
                            },
                            side5: {
                                value: parseDieValue(card[19]),
                                symbol: parseDieSymbol(card[20]),
                                costValue: parseDieCostValue(card[21]),
                                costSymbol: parseDieCostSymbol(card[21]),
                                isModifier: parseIsModifier(card[19]),
                                isFeral: parseIsFeral(card[19]),
                            },
                            side6: {
                                value: parseDieValue(card[22]),
                                symbol: parseDieSymbol(card[23]),
                                costValue: parseDieCostValue(card[24]),
                                costSymbol: parseDieCostSymbol(card[24]),
                                isModifier: parseIsModifier(card[22]),
                                isFeral: parseIsFeral(card[22]),
                            },
                            affiliation: card[25],
                            color: card[26],
                            cardCost: card[27],
                            life: card[28],
                            teamCost: card[29],
                            unique: card[30] === 'TRUE',
                            hasDie: parseHasDie(card),
                            cardImage: environment.production
                                ? card[31]
                                : card[31].replace('https://elecash.github.io/swdestiny-card-builder/', ''),
                            signature: 'Star Wars Destiny Card Builder',
                        };
                    });

                this.dataSource = new MatTableDataSource<Card>(this.cardCollection);
                setTimeout(() => {
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });

                this.currentCard = 0;

                this.updateForm(this.currentCard);
            });
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

    nextCard() {
        if (this.cardCollection.length) {
            this.currentCard++;

            if (this.currentCard > this.cardCollection.length - 1) {
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
        this.cardData = this.cardCollection[cardNumber];
    }

    downloadCollection() {
        this.currentCard = 0;
        this.updateForm(this.currentCard);
        this.zip = new JSZip();
        this.zipDice = new JSZip();
        this.downloadingCollection = true;
        this.renderCanvas();
    }

    cancelDownloadCollection() {
        this.downloadingCollection = false;
        this.currentCard = 0;
        this.updateForm(this.currentCard);
    }

    onLoadCard() {
        if (this.downloadingCollection) {
            this.renderCanvas();
        }
    }

    renderCanvas() {
        let options = {};

        if (this.cardData.type === 'BATTLEFIELD') {
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

            const formValue = this.cardData;
            const filename = `${formValue.number}-${formValue.title.split(' ').join('-').toLowerCase()}.png`;

            if (this.downloadingCollection) {
                const imgUri = canvas.toDataURL().split(';base64,')[1];
                this.zip.file(filename, imgUri, { base64: true });
                this.renderDie();
            } else {
                const link = document.createElement('a');
                link.download = formValue.title ? filename : 'filename.png';
                link.href = canvas.toDataURL();
                link.click();
            }

            document.body.removeChild(canvas);
        });
    }

    renderDie() {
        window.scrollTo(0, 0);
        if (this.dieElement && this.dieElement.nativeElement) {
            html2canvas(this.dieElement.nativeElement, { width: 1278, height: 213 }).then((canvas) => {
                document.body.appendChild(canvas);
                canvas.classList.add('card-hidden');
                const imgUri = canvas.toDataURL().split(';base64,')[1];
                const formValue = this.cardData;
                const filename = `${formValue.number}-${formValue.title.split(' ').join('-').toLowerCase()}-die.png`;

                if (this.downloadingCollection) {
                    this.zipDice.file(filename, imgUri, { base64: true });
                    this.endRenderDie();
                } else {
                    const link = document.createElement('a');
                    link.download = formValue.title ? filename : 'filename.png';
                    link.href = canvas.toDataURL();
                    link.click();
                }
                document.body.removeChild(canvas);
            });
        } else {
            this.endRenderDie();
        }
    }

    endRenderDie() {
        if (this.currentCard === this.cardCollection.length - 1) {
            this.downloadingCollection = false;
            this.zip.generateAsync({ type: 'blob' }).then((content) => {
                const link = document.createElement('a');
                link.download = 'cards.zip';
                link.href = URL.createObjectURL(content);
                link.click();
            });
            this.zipDice.generateAsync({ type: 'blob' }).then((content) => {
                const link = document.createElement('a');
                link.download = 'dice-stickers.zip';
                link.href = URL.createObjectURL(content);
                link.click();
            });
        } else {
            this.nextCard();
        }
    }
}
