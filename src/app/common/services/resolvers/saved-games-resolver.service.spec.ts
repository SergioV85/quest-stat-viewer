import { TestBed, inject } from '@angular/core/testing';

import { SavedGamesResolver } from './saved-games-resolver.service';

describe('SavedGamesResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SavedGamesResolver]
    });
  });

  it('should be created', inject([SavedGamesResolver], (service: SavedGamesResolver) => {
    expect(service).toBeTruthy();
  }));
});
