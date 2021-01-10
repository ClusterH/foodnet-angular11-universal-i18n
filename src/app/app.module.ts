import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { CoreModule } from './modules/core/core.module';
import { ShareModule } from './modules/shared/shared.module';
import { CookieModule, CookieService } from '@gorniv/ngx-universal';

import { AppComponent } from './app.component';
import { HomeComponent } from './modules/feature/home/pages/home.component';
import { NotFoundComponent } from './modules/feature/not-found/not-found.component';
import { SessionStorageService } from './modules/core';
import { CartCountService } from './modules/shared/services';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'foodnet' }),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    AppRoutingModule,
    HttpClientModule,
    ShareModule,
    CoreModule,
    CookieModule.forRoot()
  ],
  providers: [CookieService, SessionStorageService, CartCountService],
  bootstrap: [AppComponent]
})
export class AppModule { }
