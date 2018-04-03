// tslint:disable:no-any
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { test } from 'ramda';

@Injectable()
export class HttpCacheInterceptorService implements HttpInterceptor {
  private cache: Map<string, HttpResponse<any>> = new Map();

  constructor() {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET' || req.params.has('force')) {
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req.urlWithParams);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next
      .handle(req)
      .pipe(map((event) => {
        if (event instanceof HttpResponse) {
          this.cache.set(req.urlWithParams, event);
        }
        return event;
      }));
  }
}
