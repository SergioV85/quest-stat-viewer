import { TestBed, inject } from '@angular/core/testing';

import { GameDataResolver } from './game-resolver.service';

describe('GameDataResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameDataResolver]
    });
  });

  it('should be created', inject([GameDataResolver], (service: GameDataResolver) => {
    expect(service).toBeTruthy();
  }));
});
