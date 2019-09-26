import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { propOr } from 'ramda';
import { NotificationType } from '@app-common/models';

@Injectable()
export class NotificationsService {
  constructor(private readonly snackBar: MatSnackBar) {}

  public showNotification(type: NotificationType, message: { message?: string }) {
    const text = propOr('Error occurred', 'message', message) as string;
    const cssClass = [`snack-${type}-message`];

    this.snackBar.open(text, 'Скрыть', {
      politeness: 'assertive',
      duration: 2000,
      panelClass: cssClass,
    });
  }
}
