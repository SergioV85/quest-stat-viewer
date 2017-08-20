import { Routes } from '@angular/router';
import { HomeComponent } from './core/home';
import { MainPageComponent } from './core/main-page';
import { NoContentComponent } from './core/no-content';

export const ROUTES: Routes = [
  { path: '',      component: MainPageComponent },
  { path: 'home',  component: MainPageComponent },
  { path: '**',    component: NoContentComponent },
];
