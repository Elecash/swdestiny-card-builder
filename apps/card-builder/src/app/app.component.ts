import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { AboutComponent } from './about/about.component';

@Component({
    selector: 'swd-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    @ViewChild('navList') navList: MatSelectionList;

    constructor(public dialog: MatDialog) {}

    showAbout() {
        this.dialog.open(AboutComponent);
    }
}
