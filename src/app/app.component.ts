import { Component, OnInit, HostListener, LOCALE_ID } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './modules/feature/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'foodnet';
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
    }
  }

  ngOnInit(): void { }
}
