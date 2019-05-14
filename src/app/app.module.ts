import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';

import { SharedEffectsModule } from '@app-common/effects/shared-effects.module';
import { CustomRouterStateSerializer } from '@app-commonserializers/router-state/custom-router-state-serializer';

import { reducers } from '@app-common/reducers';
import { environment } from '../environments/environment';

import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';

import { NoContentComponent } from './core/no-content';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, HeaderComponent, FooterComponent, NoContentComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'quest-stat-viewer' }),
    BrowserTransferStateModule,
    RouterModule.forRoot(ROUTES),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    }),
    SharedEffectsModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    {
      provide: RouterStateSerializer,
      useClass: CustomRouterStateSerializer,
    },
  ],
})
export class AppModule {}
