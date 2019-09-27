// tslint:disable:no-any
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpCacheInterceptorService implements HttpInterceptor {
  private readonly cache: Map<string, HttpResponse<any>> = new Map();

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET' || req.params.has('force')) {
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req.urlWithParams);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(req.urlWithParams, event);
        }
        return event;
      }),
    );
  }
}
