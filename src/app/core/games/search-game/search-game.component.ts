import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { last, split, pipe, test, find } from 'ramda';

const urlRegex = /(quest.ua|en.cx).*gid=\d+/;

@Component({
  selector: 'search-game',
  templateUrl: 'search-game.component.html',
  styleUrls: ['search-game.component.scss']
})
export class SearchGameComponent implements OnInit {
  @Output() public requestGameData = new EventEmitter<QuestStat.GameRequest>();
  public gameId: number = null;
  public urlForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnInit() {
    this.urlForm = this.fb.group({
      urlInput: [null, [
        Validators.required,
        Validators.pattern(urlRegex)
      ]]
    });
  }

  public sendRequest(event) {
    event.preventDefault();

    const gameUrl = this.urlForm.get('urlInput').value;

    const domain = this.getUrl(gameUrl);
    const id = pipe(
      split('='),
      last,
      parseInt
    )(gameUrl);

    this.requestGameData.emit({
      domain,
      id
    });
  }

  private getUrl(gameUrl) {
    const regex = new RegExp(test(/quest/, gameUrl) ? /quest/ : /en.cx/);

    return pipe(
      split('/'),
      find(test(regex))
    )(gameUrl);
  }
}