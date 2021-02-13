import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TextFormatPipe } from './pipes/text-format.pipe';
import { CardComponent } from './card/card.component';
import { CardDieSideComponent } from './card/card-die.component';
import { AutosizeDirective } from './directives/autosize.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AppRoutingModule } from './app-routing.module';
import { BuilderComponent } from './builder/builder.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { WildHorizonsComponent } from './wild-horizons/wild-horizons.component';
import { DieComponent } from './die/die.component';
import { DieSideComponent } from './die/die-side.component';

@NgModule({
    declarations: [
        AppComponent,
        BuilderComponent,
        WildHorizonsComponent,
        CardComponent,
        CardDieSideComponent,
        DieComponent,
        DieSideComponent,
        TextFormatPipe,
        AutosizeDirective
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatInputModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatButtonModule,
        HttpClientModule,
        MatIconModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSidenavModule,
        MatListModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
