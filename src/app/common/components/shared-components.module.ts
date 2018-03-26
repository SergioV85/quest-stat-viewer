import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {
  ButtonsModule,
  BsDropdownModule
} from 'ngx-bootstrap';

const angularMaterialComponents = [
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
];
const ngxBootstrapComponents = [
  ButtonsModule,
  BsDropdownModule
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...angularMaterialComponents,
    ...ngxBootstrapComponents
  ],
  declarations: [],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ...angularMaterialComponents,
    ...ngxBootstrapComponents
  ]
})
export class SharedComponentsModule {
  public static forRoot() {
    return {
      ngModule: SharedComponentsModule
    };
  }
}
