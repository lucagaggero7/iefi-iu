import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { path: 'home', component: HomeComponent },

    {
        path: 'web1',
        loadComponent: () =>
            import('./web1/web1.component').then(m => m.Web1Component)
    },
    {
        path: 'web2',
        loadComponent: () =>
            import('./web2/web2.component').then(m => m.Web2Component)
    },

];


