import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from './modules/core/core.module';
import { ShareModule } from './modules/shared/shared.module';
import { CookieModule, CookieService } from '@gorniv/ngx-universal';

import { AppComponent } from './app.component';
import { HomeComponent } from './modules/feature/home/pages/home.component';
import { NotFoundComponent } from './modules/feature/not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'foodnet' }),
    AppRoutingModule,
    HttpClientModule,
    ShareModule,
    CoreModule,
    CookieModule.forRoot()
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }