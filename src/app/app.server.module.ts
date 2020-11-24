import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { CookieBackendService, CookieService } from '@gorniv/ngx-universal';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: CookieService, useClass: CookieBackendService }
  ]
})
export class AppServerModule { }
