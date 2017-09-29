import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef } from '@angular/core';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';

import { AngularMaterialModule } from './common/modules/angular-material.module';
import { BootstrapModule } from './common/modules/bootstap.module';

import { AppComponent } from './app.component';

import { ApiService } from './common/services/api.service';
import { SharedService } from './common/services/shared.service';
import { UtilService } from './common/services/util.service';
import { DeviceService } from './common/services/device.service';
import { GameDataResolver } from './common/resolvers/game-resolver.service';

import { FormatDateTimePipe } from './common/pipes/date-format.pipe';
import { FormatDurationPipe } from './common/pipes/duration-transorm.pipe';

import { NoContentComponent } from './core/no-content';
import { GameTableComponent } from './core/game-table/game-table.component';
import { TotalTableComponent } from './core/total-table/total-table.component';
import { SearchGameComponent } from './core/search-game/search-game.component';
import { SavedGamesComponent } from './core/saved-games/saved-games.component';
import { MainPageComponent } from './core/main-page/main-page.component';
import { GamePageComponent } from './core/game-page/game-page.component';
import { TeamCardComponent } from './core/team-card/team-card.component';
import { LevelCardComponent } from './core/level-card/level-card.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

import '../styles/styles.scss';
import '../styles/headings.css';

// Application wide providers
const APP_PROVIDERS = [
  GameDataResolver,
  ApiService,
  SharedService,
  UtilService,
  DeviceService
];

type StoreType = {
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    MainPageComponent,
    GamePageComponent,
    HeaderComponent,
    SearchGameComponent,
    SavedGamesComponent,
    GameTableComponent,
    TotalTableComponent,
    TeamCardComponent,
    LevelCardComponent,
    FooterComponent,
    NoContentComponent,
    FormatDateTimePipe,
    FormatDurationPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularMaterialModule,
    BootstrapModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],

  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues  = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
