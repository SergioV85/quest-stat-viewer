import { Routes } from '@angular/router';
import { HomeComponent } from './core/home';
import { NoContentComponent } from './core/no-content';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: '**',    component: NoContentComponent },
];
