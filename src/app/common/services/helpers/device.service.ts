import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'fullResolution';

@Injectable()
export class DeviceService {
  public device: Observable<DeviceType>;

  constructor() {
    const checkDevice$ = new BehaviorSubject<DeviceType>(this.getWindowSize());
    this.device = checkDevice$.pipe(distinctUntilChanged());

    fromEvent(window, 'resize')
      .pipe(map(this.getWindowSize))
      .subscribe(checkDevice$);
  }

  public isMobileDevice(): boolean {
    const userAgent = navigator.userAgent;
    let mobileDevice: boolean;

    switch (true) {
      case userAgent.match(/Android/i) !== null:
      case userAgent.match(/BB10/i) !== null:
      case userAgent.match(/BlackBerry/i) !== null:
      case userAgent.match(/PlayBook/i) !== null:
      case userAgent.match(/iPhone|iPad|iPod/i) !== null:
      case userAgent.match(/Opera Mini/i) !== null:
      case userAgent.match(/IEMobile/i) !== null:
      case userAgent.match(/WPDesktop/i) !== null:
      case userAgent.match(/Nexus/i) !== null:
        mobileDevice = true;
        break;
      default:
        mobileDevice = false;
    }
    return mobileDevice;
  }

  private getWindowSize(): DeviceType {
    let device: DeviceType;
    switch (true) {
      case window.innerWidth < 768:
        device = 'mobile';
        break;
      case window.innerWidth > 767 && window.innerWidth < 1024:
        device = 'tablet';
        break;
      case window.innerWidth > 1023 && window.innerWidth < 1229:
        device = 'desktop';
        break;
      case window.innerWidth > 1228:
      default:
        device = 'fullResolution';
        break;
    }

    return device;
  }
}
