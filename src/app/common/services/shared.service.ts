import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const DEFAULT_SETTINGS = {
  showLeaderGap: false,
  showBestTime: true
}

@Injectable()
export class SharedService {
  public teamViewSettings = new BehaviorSubject<{}>(DEFAULT_SETTINGS);
  
  constructor() {}
}