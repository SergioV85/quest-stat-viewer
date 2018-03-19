import { TestBed, inject } from '@angular/core/testing';

import { SavedGamesResolverService } from './saved-games-resolver.service';

describe('SavedGamesResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SavedGamesResolverService]
    });
  });

  it('should be created', inject([SavedGamesResolverService], (service: SavedGamesResolverService) => {
    expect(service).toBeTruthy();
  }));
});
