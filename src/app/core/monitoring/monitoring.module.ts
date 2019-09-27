import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

import { GameMonitoringResolver } from '@app-common/services/resolvers/monitoring-resolver/monitoring-data.resolver';
import { SharedPipesModule } from '@app-common/pipes/shared-pipes.module';
import { SharedServicesModule } from '@app-common/services/shared-services.module';
import { SharedComponentsModule } from '@app-common/components/shared-components.module';

import { MonitoringComponent } from './monitoring-root/monitoring.component';
import { MonitoringLoaderComponent } from './monitoring-loader/monitoring-loader.component';
import { MonitoringTotalComponent } from './monitoring-total/monitoring-total.component';
import { MonitoringByTeamComponent } from './monitoring-by-team/monitoring-by-team.component';
import { MonitoringAccordionComponent } from './monitoring-accordion/monitoring-accordion.component';
import { MonitoringByUserComponent } from './monitoring-by-user/monitoring-by-user.component';
import { CodesListComponent } from './codes-list/codes-list.component';

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
    SharedServicesModule,
    SharedPipesModule,
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
