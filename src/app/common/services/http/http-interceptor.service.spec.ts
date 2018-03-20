import { TestBed, inject } from '@angular/core/testing';

import { HttpCacheInterceptorService } from './http-interceptor.service';

describe('HttpInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCacheInterceptorService]
    });
  });

  it('should be created', inject([HttpCacheInterceptorService], (service: HttpCacheInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
