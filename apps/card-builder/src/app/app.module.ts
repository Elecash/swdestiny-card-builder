import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TextFormatPipe } from './text-format.pipe';
import { CardComponent } from './card/card.component';
import { DieSideComponent } from './die/side.component';
import { AutosizeDirective } from './directives/autosize.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        CardComponent,
        DieSideComponent,
        TextFormatPipe,
        AutosizeDirective
    ],
    imports: [BrowserModule, ReactiveFormsModule, BrowserAnimationsModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
