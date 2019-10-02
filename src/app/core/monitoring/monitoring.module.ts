import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedPipesModule } from '@app-common/pipes/shared-pipes.module';
import { SharedComponentsModule } from '@app-common/components/shared-components.module';

import {
  CodesListComponent,
  MonitoringAccordionComponent,
  MonitoringByTeamComponent,
  MonitoringByUserComponent,
  MonitoringComponent,
  MonitoringLoaderComponent,
  MonitoringTotalComponent,
} from './components';
import { GameMonitoringResolver } from './resolvers/monitoring-resolver/monitoring-data.resolver';
import { MonitoringEffects } from './effects/monitoring.effects';
import { monitoringReducer } from './reducers/monitoring.reducer';

export const routes: Route[] = [
  {
    path: '',
    component: MonitoringComponent,
    resolve: {
      gameData: GameMonitoringResolver,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
    SharedPipesModule,
    StoreModule.forFeature('monitoring', monitoringReducer),
    EffectsModule.forFeature([MonitoringEffects]),
  ],
  declarations: [
    MonitoringComponent,
    MonitoringLoaderComponent,
    MonitoringTotalComponent,
    MonitoringByTeamComponent,
    MonitoringAccordionComponent,
    MonitoringByUserComponent,
    CodesListComponent,
  ],
})
export class MonitoringModule {}
