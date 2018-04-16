import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { propOr } from 'ramda';

@Injectable()
export class NotificationsService {

  constructor(private snackBar: MatSnackBar) { }

  public showNotification(type, message) {
    const text = propOr('Error occurred', 'message', message) as string;
    const cssClass = [`snack-${type}-message`];

    this.snackBar.open(text, 'Скрыть', {
      politeness: 'assertive',
      duration: 2000,
      panelClass: cssClass
    });
  }

}
