import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatDurationPipe } from './duration-transorm.pipe';
import { FormatDateTimePipe } from './date-format.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormatDateTimePipe,
    FormatDurationPipe
  ],
  exports: [
    FormatDateTimePipe,
    FormatDurationPipe
  ]
})
export class SharedPipesModule { }
