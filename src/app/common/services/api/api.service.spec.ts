import { TestBed } from '@angular/core/testing';
import { TransferState, StateKey } from '@angular/platform-browser';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { mockedGames } from '@app-common/mocks/games.mock';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let apiService: ApiService;
  let httpMock: HttpTestingController;
  const mockedTransferSate = {
    hasKey: jasmine.createSpy('hasKey').and.returnValue(false),
    set: jasmine.createSpy('set'),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, { provide: TransferState, useValue: mockedTransferSate }],
    });
    apiService = TestBed.get<ApiService>(ApiService);
    httpMock = TestBed.get(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });
  describe('getSavedGames', () => {
    it('should send request for games list and return Observable<GameInfo[]>', () => {
      apiService.getSavedGames().subscribe(data => {
        expect(data).toEqual(mockedGames);
      });

      const req = httpMock.expectOne('http://localhost:3000/prod/games');
      expect(req.request.method).toBe('GET');
      req.flush(mockedGames);
    });
  });
});
