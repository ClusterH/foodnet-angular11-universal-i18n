import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from './modules/core/session-storage/session-storage.service';

@Injectable()
export class ServerStateInterceptor implements HttpInterceptor {

  constructor(
    private transferState: TransferState, private cookieService: CookieService, private sessionService: SessionStorageService

  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const headersConfig = {
      'Content-Type': 'application/json',
    };
    const token = this.cookieService.get('stay_login') ? this.cookieService.get('auth_tkn') : this.sessionService.getItem('auth_tkn');

    if (token) {
      headersConfig['x-auth-token'] = `${token}`;
    }

    const req = request.clone({ setHeaders: headersConfig });

    return next.handle(req).pipe(
      tap(event => {
        if ((event instanceof HttpResponse && (event.status === 200 || event.status === 202))) {
          this.transferState.set(makeStateKey(req.url), event.body);
        }
      }),
    );
  }
}
