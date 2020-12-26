import { Injectable, Injector, ErrorHandler } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from '../session-storage/session-storage.service';

/** Passes HttpErrorResponse to application-wide error handler */
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private cookieService: CookieService,
    private sessionService: SessionStorageService,
    private transferState: TransferState
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'application/json',
    };
    const token = this.cookieService.get('stay_login') ? this.cookieService.get('auth_tkn') : this.sessionService.getItem('auth_tkn');

    if (token) {
      headersConfig['x-auth-token'] = `${token}`;
    }
    if (request.method === 'GET') {
      const key = makeStateKey(request.url);
      const storedResponse: string = this.transferState.get(key, null);
      if (storedResponse) {
        const response = new HttpResponse({ body: storedResponse, status: 200 });
        return of(response);
      }
    }

    const req = request.clone({ setHeaders: headersConfig });
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event;
        }
      })
    );
  }
}
