import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckLevelRemovalPipe } from './check-level-removal.pipe';
import { FormatDateTimePipe } from './date-format.pipe';
import { FormatDurationPipe } from './duration-transorm.pipe';
import { GetPropertyPipe } from './get-prop.pipe';
import { TotalStatCalculationPipe } from './total-stat-calculation.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CheckLevelRemovalPipe,
    FormatDateTimePipe,
    FormatDurationPipe,
    GetPropertyPipe,
    TotalStatCalculationPipe
  ],
  exports: [
    CheckLevelRemovalPipe,
    FormatDateTimePipe,
    FormatDurationPipe,
    GetPropertyPipe,
    TotalStatCalculationPipe
  ]
})
export class SharedPipesModule { }
