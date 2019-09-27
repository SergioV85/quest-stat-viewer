import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

import { environment } from '../environments/environment';

import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';

import { NoContentComponent } from './core/no-content';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { NotificationEffects } from './common/effects/notification/notification.effects';
import { HttpCacheInterceptorService } from './common/services/http/http-interceptor.service';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, HeaderComponent, FooterComponent, NoContentComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'quest-stat-viewer' }),
    BrowserTransferStateModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    StoreModule.forRoot({ router: routerReducer }),
    EffectsModule.forRoot([NotificationEffects]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCacheInterceptorService,
      multi: true,
    },
  ],
})
export class AppModule {}
