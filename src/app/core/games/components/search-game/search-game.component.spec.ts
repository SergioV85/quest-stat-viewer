import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchGameComponent } from './search-game.component';

describe('Games: SearchGameComponent', () => {
  let component: SearchGameComponent;
  let fixture: ComponentFixture<SearchGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchGameComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchGameComponent);
    component = fixture.componentInstance;

    spyOn(component.requestGameData, 'emit');
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('sendRequest', () => {
    it('should decode input value and emit event', () => {
      component.urlInput.setValue('http://rivne.en.cx/GameDetails.aspx?gid=66829');
      component.sendRequest();
      expect(component.requestGameData.emit).toHaveBeenCalledWith({
        domain: 'rivne.en.cx',
        id: 66829,
      });
    });
  });
});
