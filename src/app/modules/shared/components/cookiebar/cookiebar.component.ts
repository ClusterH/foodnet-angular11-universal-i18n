import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from '@gorniv/ngx-universal';

@Component({
  selector: 'app-cookiebar',
  templateUrl: './cookiebar.component.html',
  styleUrls: ['./cookiebar.component.scss'],
})

export class CookieBarComponent implements OnInit {
  display: boolean;
  public isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const lang = this.cookieService.get('language') || 'ro';
    this.display = this.cookieService.get('authInfo') ? false : true;
  }

  acceptCookie() {
    if (this.display) {
      this.display = false;
      this.cookieService.put('authInfo', "accepted");
    }
  }
}

