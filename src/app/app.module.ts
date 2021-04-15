import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  StoreRouterConnectingModule,
  routerReducer,
  DefaultRouterStateSerializer,
  MinimalRouterStateSerializer,
} from '@ngrx/router-store';

import { environment } from '../environments/environment';

import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';

import { NoContentComponent } from './core/no-content/no-content.component';
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
    MatSnackBarModule,
    RouterModule.forRoot(ROUTES, { relativeLinkResolution: 'legacy' }),
    StoreModule.forRoot({ router: routerReducer }),
    EffectsModule.forRoot([NotificationEffects]),
    StoreRouterConnectingModule.forRoot({ serializer: MinimalRouterStateSerializer, stateKey: 'router' }),
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
