import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { SharedServicesModule } from '@app-common/services/shared-services.module';
import { GamesEffects } from './games/games.effects';
import { GameDetailsEffects } from './game-details/game-details.effects';
import { NotificationEffects } from './notification/notification.effects';
import { MonitoringEffects } from './monitoring/monitoring.effects';

const effects = [GamesEffects, GameDetailsEffects, NotificationEffects, MonitoringEffects];

@NgModule({
  imports: [CommonModule, SharedServicesModule, EffectsModule.forFeature(effects)],
  declarations: [],
})
export class SharedEffectsModule {
  public static forRoot() {
    return {
      ngModule: SharedEffectsModule,
    };
  }
}
