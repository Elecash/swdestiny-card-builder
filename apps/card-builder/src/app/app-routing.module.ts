import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuilderComponent } from './builder/builder.component';
import { WildHorizonsComponent } from './wild-horizons/wild-horizons.component';

const routes: Routes = [
    { path: 'builder', component: BuilderComponent },
    { path: 'wild-horizons', component: WildHorizonsComponent },
    { path: '', redirectTo: '/builder', pathMatch: 'full' }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
