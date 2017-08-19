import { ApiService } from './../../common/services/api.service';
import { Component } from '@angular/core';

@Component({
  selector: 'home',  // <home></home>
  styleUrls: [ './home.component.scss' ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public gameId: number = null;
  public gameData: string = '';

  constructor(private apiService: ApiService) {}
  
  public changeGameId($event: Event) {
    const htmlInput = $event.target as HTMLInputElement;
    this.gameId = parseInt(htmlInput.value, 10);
  }

  public requestGameData() {
    this.apiService.getGameStat(this.gameId).subscribe((data) => {
      this.gameData = data;
    });
  }
}
