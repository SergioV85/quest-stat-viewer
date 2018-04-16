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
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTabsModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {
  ButtonsModule,
  BsDropdownModule,
  ProgressbarModule
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
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTabsModule,
  MatTableModule,
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
    ...ngxBootstrapComponents,
    ProgressbarModule.forRoot()
  ],
  declarations: [],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ...angularMaterialComponents,
    ...ngxBootstrapComponents,
    ProgressbarModule
  ]
})
export class SharedComponentsModule {
  public static forRoot() {
    return {
      ngModule: SharedComponentsModule
    };
  }
}
