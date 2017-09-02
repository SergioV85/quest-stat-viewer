import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { ApiService } from './../../common/services/api.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'main-page',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.scss']
})
export class MainPageComponent {
  public gameData: QuestStat.GameData;
  public dataRequested: boolean;
  public errorMessage: string;

  constructor(private router: Router, private snackBar: MdSnackBar) {}

  public searchGame(searchRequest: QuestStat.GameRequest, ) {
    this.dataRequested = true;
    this.router.navigate([searchRequest.domain, searchRequest.id]);
  }
}
