import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckLevelRemovalPipe } from './check-level-removal.pipe';
import { FormatDateTimePipe } from './date-format.pipe';
import { FormatDurationPipe } from './duration-transorm.pipe';
import { GetPropertyPipe } from './get-prop.pipe';
import { TotalStatCalculationPipe } from './total-stat-calculation.pipe';
import { FormatEndingPipe } from './format-ending.pipe';
import { FilterByPropPipe } from './filter-by-prop.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CheckLevelRemovalPipe,
    FilterByPropPipe,
    FormatDateTimePipe,
    FormatDurationPipe,
    FormatEndingPipe,
    GetPropertyPipe,
    TotalStatCalculationPipe
  ],
  exports: [
    CheckLevelRemovalPipe,
    FilterByPropPipe,
    FormatDateTimePipe,
    FormatDurationPipe,
    FormatEndingPipe,
    GetPropertyPipe,
    TotalStatCalculationPipe
  ]
})
export class SharedPipesModule { }
