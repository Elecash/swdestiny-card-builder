import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';

@Component({
    selector: 'swd-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    @ViewChild('navList') navList: MatSelectionList;
}
