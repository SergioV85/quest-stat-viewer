import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedComponentsModule } from '@app-common/components/shared-components.module';

import { ApiService } from './api/api.service';
import { DeviceService } from './helpers/device.service';
import { UtilService } from './helpers/util.service';
import { HttpCacheInterceptorService } from './http/http-interceptor.service';
import { NotificationsService } from './notification/notification.service';
import { GameDataResolver } from './resolvers/game-resolver.service';
import { SavedGamesResolver } from './resolvers/saved-games-resolver.service';

import { SharedService } from './shared.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedComponentsModule
  ],
  declarations: [],
  providers: [
    GameDataResolver,
    SavedGamesResolver,
    ApiService,
    NotificationsService,
    SharedService,
    UtilService,
    DeviceService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCacheInterceptorService,
      multi: true,
    },
  ]
})
export class SharedServicesModule { }
