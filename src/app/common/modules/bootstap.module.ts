import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ButtonsModule,
    BsDropdownModule
} from 'ngx-bootstrap';

@NgModule({
  imports: [
      CommonModule,
      ButtonsModule,
      BsDropdownModule.forRoot()
  ],
  declarations: [],
  exports: [
    ButtonsModule,
    BsDropdownModule
  ]
})
export class BootstrapModule { }
