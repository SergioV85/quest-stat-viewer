import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckLevelRemovalPipe } from './check-level-removal/check-level-removal.pipe';
import { FilterByPropPipe } from './filter-by-prop/filter-by-prop.pipe';
import { FormatDateTimePipe } from './date-format/date-format.pipe';
import { FormatDurationPipe } from './duration-transform/duration-transform.pipe';
import { FormatEndingPipe } from './format-ending/format-ending.pipe';
import { GetPropertyPipe } from './get-prop/get-prop.pipe';
import { MultiplyNumberPipe } from './multiply-number/multiply-number.pipe';
import { TotalStatCalculationPipe } from './total-stat-calculation/total-stat-calculation.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    CheckLevelRemovalPipe,
    FilterByPropPipe,
    FormatDateTimePipe,
    FormatDurationPipe,
    FormatEndingPipe,
    GetPropertyPipe,
    MultiplyNumberPipe,
    TotalStatCalculationPipe,
  ],
  exports: [
    CheckLevelRemovalPipe,
    FilterByPropPipe,
    FormatDateTimePipe,
    FormatDurationPipe,
    FormatEndingPipe,
    GetPropertyPipe,
    MultiplyNumberPipe,
    TotalStatCalculationPipe,
  ],
})
export class SharedPipesModule {}
