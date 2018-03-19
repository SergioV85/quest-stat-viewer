import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { SharedComponentsModule } from '@app-common/components/shared-components.module';
import { SharedEffectsModule } from '@app-common/effects/shared-effects.module';

import { reducers } from '@app-common/reducers';
import { environment } from '../environments/environment';

import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';

import { NoContentComponent } from './core/no-content';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';


@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NoContentComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'quest-stat-viewer' }),
    BrowserTransferStateModule,
    RouterModule.forRoot(ROUTES),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    SharedEffectsModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ]
})
export class AppModule {}
