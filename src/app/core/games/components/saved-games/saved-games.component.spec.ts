import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material';
import { mockedGames } from '@app-common/mocks/games.mock';
import { SavedGamesComponent } from './saved-games.component';

describe('Games: SavedGamesComponent', () => {
  let component: SavedGamesComponent;
  let fixture: ComponentFixture<SavedGamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedGamesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SavedGamesComponent);
    component = fixture.componentInstance;
    component.savedGames = mockedGames;
    spyOn(component.requestGameData, 'emit');
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should extract available domains from games list', () => {
      expect(component.domains).toEqual([]);
    });
    it('should show all games on init', () => {
      expect(component.games).toEqual(mockedGames);
    });
  });

  describe('filterByDomain', () => {
    it('should filter the list', () => {
      component.filterByDomain({ value: mockedGames[1] } as MatSelectChange);
      expect(component.games.length).toEqual(1);
    });
  });

  describe('selectGame', () => {
    it('should emit output event with game details', () => {
      component.selectGame(mockedGames[1]);
      expect(component.requestGameData.emit).toHaveBeenCalledWith(['dp.en.cx', 60675]);
    });
  });
});
